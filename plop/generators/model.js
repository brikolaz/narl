import { toCamelCase, toConstantCase } from "../names.js";
import {
  getCoreImport,
  getFactoryImport,
  getScaffoldTarget,
  validateScaffoldTarget,
} from "../scaffold.js";

export const registerComponentGenerator = (plop) => {
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
};

export const registerEntityGenerator = (plop) => {
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
            factoryType: "Factory",
          },
        },
      ];
    },
  });
};
