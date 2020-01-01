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
  isExpression,
  objectExpression,
  objectProperty,
  numericLiteral,
  Program,
  importDeclaration,
  stringLiteral,
  importSpecifier,
  variableDeclaration,
  variableDeclarator,
  isBlock,
  arrowFunctionExpression,
} from '@babel/types';
import configuration, { IConfiguration } from './configuration';
import { replace } from './replace';

let _px2rem: Identifier | undefined;
let _options: Identifier | undefined;

function isStyledTagged(tagged: TaggedTemplateExpression) {
  const tag = tagged.tag;
  if (isIdentifier(tag)) {
    return isStyled(tag);
  } else if (isMemberExpression(tag) && isIdentifier(tag.object)) {
    return isStyled(tag.object);
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

function transformTemplateElement(it: TemplateElement): void {
  if (it.value && it.value.raw) {
    it.value.raw = replace(it.value.raw);
  }
  if (it.value && it.value.cooked) {
    it.value.cooked = replace(it.value.cooked);
  }
}

function transform(template: TemplateLiteral): void {
  if (!template.expressions || template.expressions.length === 0) {
    template.quasis.forEach(transformTemplateElement);
  } else {
    const expressions: (Expression | TemplateElement)[] = [...template.expressions, ...template.quasis];
    expressions.sort((it1, it2) => (it1.start || 0) - (it2.start || 0));
    for (let i = 0; i < expressions.length; i++) {
      const expression = expressions[i];
      if (isTemplateElement(expression)) {
        transformTemplateElement(expression);
      } else if (_px2rem && _options) {
        const next = expressions[i + 1];
        if (next && isTemplateElement(next)) {
          const text = next.value?.raw || next.value?.cooked;
          if (text && /^px/.test(text)) {
            if (isArrowFunctionExpression(expression)) {
              if (isBlock(expression.body)) {
                expression.body = callExpression(_px2rem, [
                  arrowFunctionExpression(
                    [],
                    expression.body
                  ),
                ]);
              } else {
                expression.body = callExpression(_px2rem, [expression.body, _options]);
              }
            } else {
              const idx = template.expressions.findIndex(it => it === expression);
              if (idx !== -1) {
                template.expressions[idx] = callExpression(_px2rem, [expression, _options]);
              }
            }
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
    TemplateLiteral: {
      exit(templateLiteralPath: NodePath<TemplateLiteral>) {},
      enter(templateLiteralPath: NodePath<TemplateLiteral>) {
        transform(templateLiteralPath.node);
      },
    },
  };

  const visitor: Visitor = {
    Program: {
      exit() {
        _px2rem = undefined;
        _options = undefined;
      },
      enter(programPath: NodePath<Program>) {
        if (configuration.config.transformRuntime) {
          _px2rem = programPath.scope.generateUidIdentifier('px2rem');
          _options = programPath.scope.generateUidIdentifier('OPTIONS');
          programPath.node.body.unshift(
            variableDeclaration('var', [
              variableDeclarator(
                _options,
                objectExpression([
                  objectProperty(identifier('rootValue'), numericLiteral(configuration.config.rootValue)),
                  objectProperty(identifier('unitPrecision'), numericLiteral(configuration.config.unitPrecision)),
                  objectProperty(identifier('multiplier'), numericLiteral(configuration.config.multiplier)),
                  objectProperty(identifier('minPixelValue'), numericLiteral(configuration.config.minPixelValue)),
                ]),
              ),
            ]),
          );
          programPath.node.body.unshift(
            importDeclaration(
              [importSpecifier(_px2rem, identifier('px2rem'))],
              stringLiteral('babel-plugin-styled-components-px2rem/lib/px2rem'),
            ),
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
