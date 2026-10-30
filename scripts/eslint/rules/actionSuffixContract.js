export const actionSuffixContract = {
  meta: {
    type: "problem",
    docs: {
      description: "Allow the Action suffix only once in identifier names",
    },
    schema: [],
    messages: {
      repeated: "Identifier '{{name}}' must use the Action suffix only once.",
    },
  },
  create(context) {
    return {
      Identifier(node) {
        if (/(?:Action){2,}$/.test(node.name)) {
          context.report({
            node,
            messageId: "repeated",
            data: { name: node.name },
          })
        }
      },
    }
  },
}
