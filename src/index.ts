import { ConfigAPI } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import { Visitor, NodePath } from '@babel/traverse';
import {
  TaggedTemplateExpression,
  CallExpression,
  isIdentifier,
  isTemplateLiteral,
  isMemberExpression,
  isCallExpression,
  Identifier,
  isArrowFunctionExpression,
  ArrowFunctionExpression,
  TemplateLiteral,
  MemberExpression,
} from '@babel/types';
import configuration, { IConfiguration } from './configuration';
import { replace } from './replace';

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

function transform(template: TemplateLiteral): void {
  template.quasis.forEach(it => {
    if (it.value && it.value.raw) {
      it.value.raw = replace(it.value.raw);
    }
    if (it.value && it.value.cooked) {
      it.value.cooked = replace(it.value.cooked);
    }
  });
}

export default declare((api: ConfigAPI, options?: IConfiguration) => {
  api.assertVersion(7);
  console.log('custom options:', options);
  configuration.updateConfig(options);
  const visitor: Visitor = {
    TaggedTemplateExpression(path: NodePath<TaggedTemplateExpression>) {
      if (isStyledTagged(path.node)) {
        transform(path.node.quasi);
      }
    },
    CallExpression(path: NodePath<CallExpression>) {
      if (
        isMemberExpression(path.node.callee) &&
        isIdentifier(path.node.callee.object) &&
        isStyled(path.node.callee.object)
      ) {
        if (path.node.arguments.length >= 1 && isArrowFunctionExpression(path.node.arguments[0])) {
          const arrowFn = path.node.arguments[0] as ArrowFunctionExpression;
          if (isTemplateLiteral(arrowFn.body)) {
            transform(arrowFn.body);
          }
        }
      }
    },
  };
  return {
    name: 'styled-components-px2rem',
    visitor,
  };
});
