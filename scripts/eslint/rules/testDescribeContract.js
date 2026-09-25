import path from "node:path"

function isDescribe(node) {
  if (node.type === "Identifier") return node.name === "describe"
  if (node.type === "MemberExpression") return isDescribe(node.object)
  if (node.type === "CallExpression") return isDescribe(node.callee)
  if (node.type === "TaggedTemplateExpression") return isDescribe(node.tag)
  return false
}

export const testDescribeContract = {
  meta: {
    type: "problem",
    docs: {
      description: "Require root describe titles to match the test filename",
    },
    schema: [],
    messages: {
      title:
        'Root describe title must be "{{expected}}" to match the filename.',
    },
  },
  create(context) {
    const filename = path.basename(context.filename)
    if (!/\.(?:test|spec)\.tsx?$/.test(filename)) return {}
    const expected = filename.replace(/\.(?:test|spec)\.tsx?$/, "")

    return {
      CallExpression(node) {
        if (!isDescribe(node.callee)) return
        // Ignore builder calls such as describe.each(cases) and describe.skipIf(flag).
        if (
          (node.parent.type === "CallExpression" &&
            node.parent.callee === node) ||
          (node.parent.type === "MemberExpression" &&
            node.parent.object === node)
        )
          return
        for (let parent = node.parent; parent; parent = parent.parent) {
          if (parent.type === "CallExpression" && isDescribe(parent.callee))
            return
        }

        const title = node.arguments[0]
        const value =
          title?.type === "Literal"
            ? title.value
            : title?.type === "TemplateLiteral" &&
                title.expressions.length === 0
              ? title.quasis[0].value.cooked
              : undefined
        if (value !== expected) {
          context.report({
            node: title ?? node,
            messageId: "title",
            data: { expected },
          })
        }
      },
    }
  },
}
