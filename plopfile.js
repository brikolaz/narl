import { readFileSync, writeFileSync } from "node:fs";
import jscodeshift from "jscodeshift";

const MOBS_PATH = "src/game/model/entities/mobs";
const j = jscodeshift.withParser("ts");

const toWords = (value) =>
  value
    .replace(/Entity$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const toPascalCase = (value) =>
  toWords(value)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join("");

const toCamelCase = (value) => {
  const pascalCase = toPascalCase(value);
  return pascalCase[0].toLowerCase() + pascalCase.slice(1);
};

const toConstantCase = (value) =>
  toWords(value)
    .map((word) => word.toUpperCase())
    .join("_");

const isIdentifier = (node, name) =>
  node?.type === "Identifier" && node.name === name;

const addImports = (program, imports) => {
  const newDeclarations = [];

  for (const definition of imports) {
    const declaration = program.body.find(
      (node) =>
        node.type === "ImportDeclaration" &&
        node.source.value === definition.source,
    );
    const missingNames = definition.names.filter(
      (name) =>
        !declaration?.specifiers.some(
          (specifier) =>
            specifier.type === "ImportSpecifier" &&
            isIdentifier(specifier.imported, name),
        ),
    );

    if (declaration) {
      declaration.specifiers.push(
        ...missingNames.map((name) => j.importSpecifier(j.identifier(name))),
      );
      continue;
    }
    if (missingNames.length > 0) {
      newDeclarations.push(
        j.importDeclaration(
          missingNames.map((name) => j.importSpecifier(j.identifier(name))),
          j.stringLiteral(definition.source),
        ),
      );
    }
  }

  const lastImportIndex = program.body.findLastIndex(
    (node) => node.type === "ImportDeclaration",
  );
  const insertIndex = lastImportIndex === -1 ? 0 : lastImportIndex;
  program.body.splice(insertIndex, 0, ...newDeclarations);
};

const getRegistryEntries = (root, mapName, filePath) => {
  const declarators = root.find(j.VariableDeclarator, {
    id: { type: "Identifier", name: mapName },
  });
  if (declarators.size() !== 1) {
    throw new Error(`Expected one ${mapName} declaration in ${filePath}`);
  }

  const initializer = declarators.nodes()[0].init;
  const entries = initializer?.arguments?.[0];
  if (
    initializer?.type !== "NewExpression" ||
    !isIdentifier(initializer.callee, "Map") ||
    entries?.type !== "ArrayExpression"
  ) {
    throw new Error(`${mapName} is not initialized with new Map([...])`);
  }

  return entries.elements;
};

const wireRegistry = ({
  filePath,
  imports,
  mapName,
  entityName,
  valueName,
}) => {
  const source = readFileSync(filePath, "utf8");
  const root = j(source);
  const entries = getRegistryEntries(root, mapName, filePath);
  const alreadyWired = entries.some(
    (entry) =>
      entry?.type === "ArrayExpression" &&
      entry.elements.length === 2 &&
      entry.elements[0]?.type === "MemberExpression" &&
      isIdentifier(entry.elements[0].object, entityName) &&
      isIdentifier(entry.elements[0].property, "type") &&
      isIdentifier(entry.elements[1], valueName),
  );
  const entryLabel = `[${entityName}.type, ${valueName}]`;
  if (alreadyWired) {
    return `${filePath} already contains ${entryLabel}`;
  }

  const program = root.find(j.Program).nodes()[0];
  addImports(program, imports);
  entries.push(
    j.arrayExpression([
      j.memberExpression(j.identifier(entityName), j.identifier("type")),
      j.identifier(valueName),
    ]),
  );

  const output = root.toSource({ quote: "double", trailingComma: true });
  writeFileSync(filePath, output.endsWith("\n") ? output : `${output}\n`);
  return `wired ${entryLabel} in ${filePath}`;
};

export default function plopfile(plop) {
  plop.setHelper("mobName", toPascalCase);
  plop.setHelper("mobFolder", toCamelCase);
  plop.setHelper("mobType", toConstantCase);

  plop.setActionType("wireMobRegistries", (answers) => {
    const name = toPascalCase(answers.name);
    const folder = toCamelCase(answers.name);

    const factoryResult = wireRegistry({
      filePath: `${MOBS_PATH}/factories.ts`,
      imports: [
        {
          source: `./${folder}/${name}Entity`,
          names: [`${name}Entity`, `${name}EntityFactory`],
        },
      ],
      mapName: "MOB_FACTORIES",
      entityName: `${name}Entity`,
      valueName: `${name}EntityFactory`,
    });
    const manualResult = wireRegistry({
      filePath: `${MOBS_PATH}/manuals.ts`,
      imports: [
        {
          source: `./${folder}/${name}Entity`,
          names: [`${name}Entity`],
        },
        {
          source: `./${folder}/${name}EntityManual`,
          names: [`${name}EntityManual`],
        },
      ],
      mapName: "MOB_MANUALS",
      entityName: `${name}Entity`,
      valueName: `${name}EntityManual`,
    });

    return `${factoryResult}; ${manualResult}`;
  });

  plop.setGenerator("mob", {
    description: "Create a mob entity boilerplate and wire its registries",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Mob name:",
        validate: (value) =>
          toPascalCase(value).length > 0 || "Mob name is required",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${MOBS_PATH}/{{mobFolder name}}/{{mobName name}}Entity.ts`,
        templateFile: "plop-templates/mob/Entity.ts.hbs",
      },
      {
        type: "add",
        path: `${MOBS_PATH}/{{mobFolder name}}/{{mobName name}}EntityManual.ts`,
        templateFile: "plop-templates/mob/EntityManual.ts.hbs",
      },
      {
        type: "wireMobRegistries",
      },
    ],
  });
}
