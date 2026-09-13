import path from "node:path"
import {
  getEnumObject,
  getName,
  getTypeArguments,
  getTypeReferenceName,
  getUnionMemberNames,
  unwrapExpression,
} from "../ast.js"
import { toConstantCase, toPascalCase } from "../names.js"

const ACTION_DOMAINS = ["Player", "World", "Internal"]

const getActionTypeFromParameter = (parameter) => {
  const annotation = parameter?.typeAnnotation?.typeAnnotation
  return getTypeReferenceName(annotation)
}

export const actionContract = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce action types, resolvers, filenames, and resolver-map entries",
    },
    schema: [],
    messages: {
      actionType:
        "Action '{{actual}}' must be named '{{expected}}' for discriminant '{{key}}'.",
      discriminant:
        "Action '{{name}}' must use discriminant {{object}}.{{expected}}.",
      resolver: "Resolver for '{{action}}' must be named '{{expected}}'.",
      resolverFile:
        "Resolver '{{resolver}}' must be declared in '{{expected}}'.",
      mapEntry:
        "Resolver-map entry {{object}}.{{key}} must reference '{{expected}}'.",
      unionMissing: "{{domain}}Action must include action type '{{name}}'.",
      unionExtra:
        "{{domain}}Action contains unexpected action type '{{name}}'.",
      mapMissing:
        "Resolver map for {{domain}}Action must include {{object}}.{{key}}.",
    },
  },
  create(context) {
    const filename = context.filename.replaceAll(path.sep, "/")
    const aliases = []
    const variables = []
    const functions = []
    const services = context.sourceCode.parserServices
    const checker = services.program?.getTypeChecker()
    const nodeMap = services.esTreeNodeToTSNodeMap

    return {
      TSTypeAliasDeclaration(node) {
        aliases.push(node)
      },
      VariableDeclarator(node) {
        variables.push(node)
      },
      FunctionDeclaration(node) {
        functions.push(node)
      },
      "Program:exit"() {
        const actionEnums = new Map()
        for (const variable of variables) {
          const name = getName(variable.id)
          const match = name?.match(/^(Player|World|Internal)ActionTypeEnum$/)
          const object = getEnumObject(variable.init)
          if (match && object) actionEnums.set(match[1], object)
        }

        for (const [domain, object] of actionEnums) {
          const objectName = `${domain}ActionTypeEnum`
          const actionPrefix = `${domain.toUpperCase()}_`
          const expectedActions = new Set()
          for (const property of object.properties) {
            if (property.type !== "Property" || property.computed) continue
            const key = getName(property.key)
            if (!key) continue
            const actionKey = key.startsWith(actionPrefix)
              ? key.slice(actionPrefix.length)
              : key
            const expected = `${domain}${toPascalCase(actionKey)}Action`
            expectedActions.add(expected)
            const alias = aliases.find((candidate) => {
              const typeLiteral = candidate.typeAnnotation
              if (typeLiteral.type !== "TSTypeLiteral") return false
              const typeProperty = typeLiteral.members.find(
                (member) =>
                  member.type === "TSPropertySignature" &&
                  getName(member.key) === "type",
              )
              const query = typeProperty?.typeAnnotation?.typeAnnotation
              const qualified =
                query?.type === "TSTypeQuery" ? query.exprName : undefined
              return (
                qualified?.type === "TSQualifiedName" &&
                getName(qualified.left) === objectName &&
                getName(qualified.right) === key
              )
            })
            if (!alias || alias.id.name !== expected) {
              context.report({
                node: alias?.id ?? property.key,
                messageId: "actionType",
                data: { actual: alias?.id.name ?? "<missing>", expected, key },
              })
            }
          }

          const union = aliases.find(
            (alias) => alias.id.name === `${domain}Action`,
          )
          const actualActions = getUnionMemberNames(union?.typeAnnotation)
          for (const name of expectedActions) {
            if (!actualActions.has(name)) {
              context.report({
                node: union?.id ?? object.node,
                messageId: "unionMissing",
                data: { domain, name },
              })
            }
          }
          for (const name of actualActions) {
            if (!expectedActions.has(name)) {
              context.report({
                node: union?.id ?? object.node,
                messageId: "unionExtra",
                data: { domain, name },
              })
            }
          }
        }

        for (const alias of aliases) {
          const match = alias.id.name.match(
            /^(Player|World|Internal)(.+)Action$/,
          )
          if (!match || alias.typeAnnotation.type !== "TSTypeLiteral") continue
          const [, domain, actionName] = match
          const property = alias.typeAnnotation.members.find(
            (member) =>
              member.type === "TSPropertySignature" &&
              getName(member.key) === "type",
          )
          const query = property?.typeAnnotation?.typeAnnotation
          const qualified =
            query?.type === "TSTypeQuery" ? query.exprName : undefined
          const expectedObject = `${domain}ActionTypeEnum`
          const expectedKey = `${domain.toUpperCase()}_${toConstantCase(actionName)}`
          if (
            qualified?.type !== "TSQualifiedName" ||
            getName(qualified.left) !== expectedObject ||
            getName(qualified.right) !== expectedKey
          ) {
            context.report({
              node: alias.id,
              messageId: "discriminant",
              data: {
                name: alias.id.name,
                object: expectedObject,
                expected: expectedKey,
              },
            })
          }
        }

        const resolverDeclarations = [
          ...variables
            .map((variable) => ({
              nameNode: variable.id,
              name: getName(variable.id),
              value: unwrapExpression(variable.init),
            }))
            .filter(({ value }) =>
              ["ArrowFunctionExpression", "FunctionExpression"].includes(
                value?.type,
              ),
            ),
          ...functions.map((fn) => ({
            nameNode: fn.id,
            name: getName(fn.id),
            value: fn,
          })),
        ]

        for (const resolver of resolverDeclarations) {
          if (!resolver.name?.startsWith("resolve")) continue
          const actionType = getActionTypeFromParameter(
            resolver.value.params[0],
          )
          const match = actionType?.match(/^(Player|World|Internal)(.+)Action$/)
          if (!match) continue
          const expected = `resolve${actionType}`
          if (resolver.name !== expected) {
            context.report({
              node: resolver.nameNode,
              messageId: "resolver",
              data: { action: actionType, expected },
            })
          }
          const expectedFile = `${expected}.ts`
          if (path.basename(filename) !== expectedFile) {
            context.report({
              node: resolver.nameNode,
              messageId: "resolverFile",
              data: { resolver: expected, expected: expectedFile },
            })
          }
        }

        for (const variable of variables) {
          const initializer = variable.init
          if (
            initializer?.type !== "TSSatisfiesExpression" ||
            getTypeReferenceName(initializer.typeAnnotation) !==
              "ActionResolverMap"
          ) {
            continue
          }
          const object = unwrapExpression(initializer.expression)
          if (object?.type !== "ObjectExpression") continue
          const actionType = getTypeReferenceName(
            getTypeArguments(initializer.typeAnnotation)[0],
          )
          const domain = ACTION_DOMAINS.find(
            (candidate) => actionType === `${candidate}Action`,
          )
          const objectName = domain ? `${domain}ActionTypeEnum` : undefined
          const actualKeys = new Set()
          for (const property of object.properties) {
            if (property.type !== "Property" || !property.computed) continue
            const member = unwrapExpression(property.key)
            if (member?.type !== "MemberExpression") continue
            const entryObjectName = getName(member.object)
            const key = getName(member.property)
            const match = entryObjectName?.match(
              /^(Player|World|Internal)ActionTypeEnum$/,
            )
            if (!match || !key) continue
            if (entryObjectName === objectName) actualKeys.add(key)
            const actionPrefix = `${match[1].toUpperCase()}_`
            const actionKey = key.startsWith(actionPrefix)
              ? key.slice(actionPrefix.length)
              : key
            const expected = `resolve${match[1]}${toPascalCase(actionKey)}Action`
            if (getName(property.value) !== expected) {
              context.report({
                node: property.value,
                messageId: "mapEntry",
                data: { object: entryObjectName, key, expected },
              })
            }
          }

          if (domain && objectName && checker && nodeMap) {
            const importSpecifier = context.sourceCode.ast.body
              .filter((statement) => statement.type === "ImportDeclaration")
              .flatMap((statement) => statement.specifiers)
              .find((specifier) => specifier.local.name === objectName)
            if (importSpecifier) {
              const type = checker.getTypeAtLocation(
                nodeMap.get(importSpecifier.local),
              )
              for (const symbol of checker.getPropertiesOfType(type)) {
                const key = symbol.getName()
                if (!actualKeys.has(key)) {
                  context.report({
                    node: variable.id,
                    messageId: "mapMissing",
                    data: { domain, object: objectName, key },
                  })
                }
              }
            }
          }
        }
      },
    }
  },
}
