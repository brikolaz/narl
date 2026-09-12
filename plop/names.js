const toWords = (value) =>
  value
    .replace(/Entity$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export const toPascalCase = (value) =>
  toWords(value)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join("");

export const toCamelCase = (value) => {
  const pascalCase = toPascalCase(value);
  return pascalCase[0].toLowerCase() + pascalCase.slice(1);
};

export const toConstantCase = (value) =>
  toWords(value)
    .map((word) => word.toUpperCase())
    .join("_");

const toActionName = (value) =>
  toPascalCase(value.replace(/Action$/i, ""));

export const toActionFolder = (value) => {
  const name = toActionName(value);
  return name[0].toLowerCase() + name.slice(1);
};

export const normalizeActionName = (value, kindName) => {
  const name = toActionName(value);
  return name.startsWith(kindName) ? name.slice(kindName.length) : name;
};

export const registerTemplateHelpers = (plop) => {
  plop.setHelper("mobName", toPascalCase);
  plop.setHelper("mobFolder", toCamelCase);
  plop.setHelper("mobType", toConstantCase);
  plop.setHelper("actionName", toActionName);
  plop.setHelper("actionFolder", toActionFolder);
};
