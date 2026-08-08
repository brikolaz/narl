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

const toActionName = (value) =>
  toPascalCase(value.replace(/Action$/i, ""));

const toActionFolder = (value) => {
  const name = toActionName(value);
  return name[0].toLowerCase() + name.slice(1);
};

const normalizeActionName = (value, kindName) => {
  const name = toActionName(value);
  return name.startsWith(kindName) ? name.slice(kindName.length) : name;
};

const getScaffoldTarget = (value, suffix) => {
  const parts = value
    .replaceAll("\\", "/")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const rawName =
    parts.pop()?.replace(new RegExp(`${suffix}$`, "i"), "") ?? "";
  const name = toPascalCase(rawName);
  if (!name) {
    throw new Error(`${suffix} name is required`);
  }
  if (parts.some((part) => part === "." || part === "..")) {
    throw new Error("Relative path segments are not allowed");
  }

  return {
    folder: parts.map(toCamelCase).join("/"),
    name,
  };
};

const validateScaffoldTarget = (value, suffix) => {
  try {
    getScaffoldTarget(value, suffix);
    return true;
  } catch (error) {
    return error.message;
  }
};

const getCoreImport = (folder, moduleName) => {
  const depth = folder ? folder.split("/").length : 0;
  return `${"../".repeat(3 + depth)}core/model/${moduleName}`;
};

const getFactoryImport = (folder) => {
  const depth = folder ? folder.split("/").length : 0;
  return `${"../".repeat(1 + depth)}Factory`;
};

const isIdentifier = (node, name) =>
  node?.type === "Identifier" && node.name === name;

const unwrapExpression = (node) => {
  let expression = node;
  while (
    expression?.type === "TSAsExpression" ||
    expression?.type === "TSSatisfiesExpression"
  ) {
    expression = expression.expression;
  }
  return expression;
};

const parseStatement = (source) => j(source).find(j.Program).nodes()[0].body[0];

const writeAst = (filePath, root) => {
  const output = root.toSource({ quote: "double", trailingComma: true });
  writeFileSync(filePath, output.endsWith("\n") ? output : `${output}\n`);
};

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

  writeAst(filePath, root);
  return `wired ${entryLabel} in ${filePath}`;
};

const getTypeAlias = (root, name, filePath) => {
  const aliases = root.find(j.TSTypeAliasDeclaration, {
    id: { type: "Identifier", name },
  });
  if (aliases.size() !== 1) {
    throw new Error(`Expected one ${name} type alias in ${filePath}`);
  }
  return aliases.nodes()[0];
};

const wireActionTypes = ({
  filePath,
  actionTypeObject,
  actionKey,
  actionValue,
  actionTypeName,
  actionUnionName,
}) => {
  const root = j(readFileSync(filePath, "utf8"));
  const declarators = root.find(j.VariableDeclarator, {
    id: { type: "Identifier", name: actionTypeObject },
  });
  if (declarators.size() !== 1) {
    throw new Error(`Expected one ${actionTypeObject} declaration in ${filePath}`);
  }

  const actionTypes = unwrapExpression(declarators.nodes()[0].init);
  if (actionTypes?.type !== "ObjectExpression") {
    throw new Error(`${actionTypeObject} is not an object in ${filePath}`);
  }
  if (
    actionTypes.properties.some(
      (property) =>
        property.type === "ObjectProperty" &&
        isIdentifier(property.key, actionKey),
    )
  ) {
    throw new Error(`${actionTypeObject}.${actionKey} already exists`);
  }

  const enumProperty = parseStatement(
    `const value = { ${actionKey}: "${actionValue}" };`,
  ).declarations[0].init.properties[0];
  actionTypes.properties.push(enumProperty);

  const program = root.find(j.Program).nodes()[0];
  const unionStatementIndex = program.body.findIndex((statement) => {
    const declaration =
      statement.type === "ExportNamedDeclaration"
        ? statement.declaration
        : statement;
    return (
      declaration?.type === "TSTypeAliasDeclaration" &&
      isIdentifier(declaration.id, actionUnionName)
    );
  });
  if (unionStatementIndex === -1) {
    throw new Error(`No ${actionUnionName} union in ${filePath}`);
  }

  const actionTypeStatement = parseStatement(
    `export type ${actionTypeName} = { type: typeof ${actionTypeObject}.${actionKey} };`,
  );
  program.body.splice(unionStatementIndex, 0, actionTypeStatement);

  const actionUnion = getTypeAlias(root, actionUnionName, filePath);
  const actionReference = parseStatement(
    `type Value = ${actionTypeName};`,
  ).typeAnnotation;
  if (actionUnion.typeAnnotation.type === "TSUnionType") {
    actionUnion.typeAnnotation.types.push(actionReference);
  } else {
    actionUnion.typeAnnotation = j.tsUnionType([
      actionUnion.typeAnnotation,
      actionReference,
    ]);
  }

  writeAst(filePath, root);
  return `wired ${actionTypeName} in ${filePath}`;
};

const wireActionResolver = ({
  filePath,
  importSource,
  resolverName,
  resolverMapName,
  actionTypeObject,
  actionKey,
  resolverUnionName,
}) => {
  const root = j(readFileSync(filePath, "utf8"));
  const declarators = root.find(j.VariableDeclarator, {
    id: { type: "Identifier", name: resolverMapName },
  });
  if (declarators.size() !== 1) {
    throw new Error(`Expected one ${resolverMapName} declaration in ${filePath}`);
  }

  const resolverMap = unwrapExpression(declarators.nodes()[0].init);
  if (resolverMap?.type !== "ObjectExpression") {
    throw new Error(`${resolverMapName} is not an object in ${filePath}`);
  }
  const alreadyWired = resolverMap.properties.some(
    (property) =>
      property.type === "ObjectProperty" &&
      property.computed &&
      property.key.type === "MemberExpression" &&
      isIdentifier(property.key.object, actionTypeObject) &&
      isIdentifier(property.key.property, actionKey),
  );
  if (alreadyWired) {
    throw new Error(`${actionTypeObject}.${actionKey} resolver already exists`);
  }

  const program = root.find(j.Program).nodes()[0];
  addImports(program, [{ source: importSource, names: [resolverName] }]);
  const resolverProperty = parseStatement(
    `const value = { [${actionTypeObject}.${actionKey}]: ${resolverName} };`,
  ).declarations[0].init.properties[0];
  resolverMap.properties.push(resolverProperty);

  if (resolverUnionName) {
    const resolverUnion = getTypeAlias(root, resolverUnionName, filePath);
    const resolverReference = parseStatement(
      `type Value = typeof ${resolverName};`,
    ).typeAnnotation;
    if (resolverUnion.typeAnnotation.type === "TSUnionType") {
      resolverUnion.typeAnnotation.types.push(resolverReference);
    } else {
      resolverUnion.typeAnnotation = j.tsUnionType([
        resolverUnion.typeAnnotation,
        resolverReference,
      ]);
    }
  }

  writeAst(filePath, root);
  return `wired ${resolverName} in ${filePath}`;
};

const ACTION_RESOLVER_CONFIG = {
  internal: {
    actionTypeObject: "InternalActionType",
    actionTypeFile: "src/game/systems/internal/type.ts",
    actionUnionName: "InternalAction",
    resolverMapFile: "src/game/systems/internal/resolvers.ts",
    resolverMapName: "internalActionResolvers",
    resolverUnionName: "InternalActionResolver",
    actionValuePrefix: "INTERNAL_",
  },
  player: {
    actionTypeObject: "PlayerActionType",
    actionTypeFile: "src/game/systems/player/types.ts",
    actionUnionName: "PlayerAction",
    resolverMapFile: "src/game/systems/player/resolvers.ts",
    resolverMapName: "playerActionResolvers",
    actionValuePrefix: "PLAYER_",
  },
  world: {
    actionTypeObject: "WorldActionType",
    actionTypeFile: "src/game/systems/world/types.ts",
    actionUnionName: "WorldAction",
    resolverMapFile: "src/game/systems/world/resolvers.ts",
    resolverMapName: "worldActionResolvers",
    actionValuePrefix: "WORLD_",
  },
};

export default function plopfile(plop) {
  plop.setHelper("mobName", toPascalCase);
  plop.setHelper("mobFolder", toCamelCase);
  plop.setHelper("mobType", toConstantCase);
  plop.setHelper("actionName", toActionName);
  plop.setHelper("actionFolder", toActionFolder);

  plop.setGenerator("component", {
    description: "Create a component creator boilerplate",
    prompts: [
      {
        type: "input",
        name: "target",
        message: "Component path/name:",
        validate: (value) => validateScaffoldTarget(value, "Component"),
      },
    ],
    actions: (answers) => {
      const { folder, name } = getScaffoldTarget(answers.target, "Component");
      const targetFolder = folder ? `${folder}/` : "";

      return [
        {
          type: "add",
          path: `src/game/model/components/${targetFolder}${name}Component.ts`,
          templateFile: "plop-templates/component/Component.ts.hbs",
          data: {
            componentName: name,
            componentType: toConstantCase(name),
            coreImport: getCoreImport(folder, "Component"),
          },
        },
      ];
    },
  });

  plop.setGenerator("entity", {
    description: "Create an entity creator and factory boilerplate",
    prompts: [
      {
        type: "input",
        name: "target",
        message: "Entity path/name:",
        validate: (value) => validateScaffoldTarget(value, "Entity"),
      },
    ],
    actions: (answers) => {
      const { folder, name } = getScaffoldTarget(answers.target, "Entity");
      const targetFolder = folder ? `${folder}/` : "";

      return [
        {
          type: "add",
          path: `src/game/model/entities/${targetFolder}${name}Entity.ts`,
          templateFile: "plop-templates/entity/Entity.ts.hbs",
          data: {
            entityName: name,
            entityVariable: toCamelCase(name),
            entityType: toConstantCase(name),
            coreImport: getCoreImport(folder, "Entity"),
            factoryImport: getFactoryImport(folder),
          },
        },
      ];
    },
  });

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

  for (const [kind, config] of Object.entries(ACTION_RESOLVER_CONFIG)) {
    const kindName = toPascalCase(kind);
    plop.setGenerator(`action-resolver:${kind}`, {
      description: `Create and wire a ${kind} action resolver`,
      prompts: [
        {
          type: "input",
          name: "name",
          message: `${kindName} action name:`,
          validate: (value) =>
            normalizeActionName(value, kindName).length > 0 ||
            "Action name is required",
        },
      ],
      actions: (answers) => {
        const name = normalizeActionName(answers.name, kindName);
        const folder = toActionFolder(name);
        const actionKey = toConstantCase(name);
        const actionTypeName = `${kindName}${name}Action`;
        const resolverName = `resolve${kindName}${name}Action`;
        const resolverFile = `${resolverName}.ts`;

        return [
          {
            type: "add",
            path: `src/game/systems/${folder}/${resolverFile}`,
            templateFile: `plop-templates/action-resolver/${kind}.ts.hbs`,
            data: { actionTypeName, resolverName },
          },
          () =>
            wireActionTypes({
              filePath: config.actionTypeFile,
              actionTypeObject: config.actionTypeObject,
              actionKey,
              actionValue: `${config.actionValuePrefix}${actionKey}`,
              actionTypeName,
              actionUnionName: config.actionUnionName,
            }),
          () =>
            wireActionResolver({
              filePath: config.resolverMapFile,
              importSource: `../${folder}/${resolverName}`,
              resolverName,
              resolverMapName: config.resolverMapName,
              actionTypeObject: config.actionTypeObject,
              actionKey,
              resolverUnionName: config.resolverUnionName,
            }),
        ];
      },
    });
  }
}
