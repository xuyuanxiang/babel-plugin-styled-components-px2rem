import { ConfigAPI } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import { Visitor, NodePath } from '@babel/traverse';
import {
  TaggedTemplateExpression,
  CallExpression,
  isIdentifier,
  isMemberExpression,
  isCallExpression,
  Identifier,
  isArrowFunctionExpression,
  TemplateLiteral,
  MemberExpression,
  TemplateElement,
  Expression,
  isTemplateElement,
  callExpression,
  identifier,
  numericLiteral,
  Program,
  isBlock,
  arrowFunctionExpression,
  isConditionalExpression,
  StringLiteral,
  BinaryExpression,
  NumericLiteral,
  isBinaryExpression,
  isStringLiteral,
  LogicalExpression,
  isLogicalExpression,
  isNumericLiteral,
  isFunctionExpression,
  restElement,
  spreadElement,
  OptionalMemberExpression,
  isOptionalMemberExpression,
  OptionalCallExpression,
  isOptionalCallExpression,
} from '@babel/types';
import templateBuild from '@babel/template';
import configuration, { IConfiguration } from './configuration';
import { replace } from './replace';
import { px2rem } from './template';

let _px2rem: Identifier | undefined;

function isStyledTagged(tagged: TaggedTemplateExpression) {
  const tag = tagged.tag;
  if (isIdentifier(tag)) {
    return isStyled(tag);
  } else if (isMemberExpression(tag)) {
    return isStyledMember(tag);
  } else if (isCallExpression(tag)) {
    if (isIdentifier(tag.callee)) {
      return isStyled(tag.callee);
    } else if (isMemberExpression(tag.callee)) {
      return isStyledMember(tag.callee);
    }
  }
  return false;
}

function isStyledMember(member: MemberExpression): boolean {
  if (isIdentifier(member.object)) {
    return isStyled(member.object);
  } else if (isMemberExpression(member.object)) {
    return isStyledMember(member.object);
  }
  return false;
}

function isStyled(id: Identifier): boolean {
  return configuration.config.tags.indexOf(id.name) >= 0;
}

function isPureExpression(
  node: any,
): node is
  | Identifier
  | CallExpression
  | OptionalCallExpression
  | BinaryExpression
  | StringLiteral
  | NumericLiteral
  | MemberExpression
  | OptionalMemberExpression
  | LogicalExpression {
  return (
    isIdentifier(node) ||
    isCallExpression(node) ||
    isOptionalCallExpression(node) ||
    isBinaryExpression(node) ||
    isStringLiteral(node) ||
    isNumericLiteral(node) ||
    isMemberExpression(node) ||
    isOptionalMemberExpression(node) ||
    isLogicalExpression(node)
  );
}

function transformTemplateExpression(expression: Expression, px2rem: Identifier): Expression {
  if (isArrowFunctionExpression(expression)) {
    if (isBlock(expression.body)) {
      expression.body = callExpression(px2rem, [arrowFunctionExpression([], expression.body)]);
    } else if (isPureExpression(expression.body)) {
      expression.body = callExpression(px2rem, [expression.body]);
    } else {
      expression.body = transformTemplateExpression(expression.body, px2rem);
    }
  } else if (isConditionalExpression(expression)) {
    expression.alternate = transformTemplateExpression(expression.alternate, px2rem);
    expression.consequent = transformTemplateExpression(expression.consequent, px2rem);
  } else if (isPureExpression(expression)) {
    return callExpression(px2rem, [expression]);
  } else if (isFunctionExpression(expression)) {
    return arrowFunctionExpression(
      [restElement(identifier('args'))],
      callExpression(px2rem, [expression, spreadElement(identifier('args'))]),
    );
  } else {
    throw new TypeError('Incomprehensible expression type: ' + expression.type);
  }

  return expression;
}

function transform(template: TemplateLiteral): void {
  if (_px2rem) {
    const expressions: (Expression | TemplateElement)[] = [...template.expressions, ...template.quasis];
    expressions.sort((it1, it2) => (it1.start || 0) - (it2.start || 0));
    for (let i = 0; i < expressions.length; i++) {
      const expression = expressions[i];
      if (isTemplateElement(expression)) continue;
      const next = expressions[i + 1];
      if (next && isTemplateElement(next)) {
        const text = next.value?.raw || next.value?.cooked;
        if (text && /^px/.test(text)) {
          const idx = template.expressions.findIndex(it => it === expression);
          if (idx !== -1) {
            template.expressions[idx] = transformTemplateExpression(expression, _px2rem);
            if (next.value && next.value.raw) {
              next.value.raw = next.value.raw.replace(/^px/, '');
            }
            if (next.value && next.value.cooked) {
              next.value.cooked = next.value.cooked.replace(/^px/, '');
            }
          }
        }
      }
    }
  }
}

export default declare((api: ConfigAPI, options?: IConfiguration) => {
  api.assertVersion(7);
  configuration.updateConfig(options);

  const templateVisitor: Visitor = {
    TemplateElement(path: NodePath<TemplateElement>) {
      const it = path.node;
      if (it.value && it.value.raw) {
        it.value.raw = replace(it.value.raw);
      }
      if (it.value && it.value.cooked) {
        it.value.cooked = replace(it.value.cooked);
      }
    },
    StringLiteral(path: NodePath<StringLiteral>) {
      path.node.value = replace(path.node.value);
    },
  };

  if (configuration.config.transformRuntime) {
    templateVisitor.TemplateLiteral = (path: NodePath<TemplateLiteral>) => {
      try {
        transform(path.node);
      } catch (e) {
        throw path.buildCodeFrameError(e.message);
      }
    };
  }

  const visitor: Visitor = {
    Program: {
      exit() {
        _px2rem = undefined;
      },
      enter(programPath: NodePath<Program>) {
        if (configuration.config.transformRuntime) {
          _px2rem = programPath.scope.generateUidIdentifier('px2rem');
          const template = templateBuild.statement(px2rem);
          programPath.node.body.push(
            template({
              input: identifier('input'),
              px2rem: _px2rem,
              rootValue: numericLiteral(configuration.config.rootValue),
              unitPrecision: numericLiteral(configuration.config.unitPrecision),
              multiplier: numericLiteral(configuration.config.multiplier),
              minPixelValue: numericLiteral(configuration.config.minPixelValue),
            }),
          );
        }
        programPath.traverse({
          TaggedTemplateExpression(path: NodePath<TaggedTemplateExpression>) {
            if (isStyledTagged(path.node)) {
              path.traverse(templateVisitor);
            }
          },
          CallExpression(path: NodePath<CallExpression>) {
            if (
              isMemberExpression(path.node.callee) &&
              isIdentifier(path.node.callee.object) &&
              isStyled(path.node.callee.object)
            ) {
              path.traverse(templateVisitor);
            }
          },
        });
      },
    },
  };
  return {
    name: 'styled-components-px2rem',
    visitor,
  };
});
