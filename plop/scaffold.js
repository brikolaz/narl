import { toCamelCase, toPascalCase } from "./names.js";

export const getScaffoldTarget = (value, suffix) => {
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

export const validateScaffoldTarget = (value, suffix) => {
  try {
    getScaffoldTarget(value, suffix);
    return true;
  } catch (error) {
    return error.message;
  }
};

export const getCoreImport = (folder, moduleName) => {
  const depth = folder ? folder.split("/").length : 0;
  return `${"../".repeat(3 + depth)}core/model/${moduleName}`;
};

export const getFactoryImport = (folder) => {
  const depth = folder ? folder.split("/").length : 0;
  return `${"../".repeat(1 + depth)}Factory`;
};

export const getBaseMobFactoryImport = (folder) => {
  const depth = folder ? folder.split("/").length : 0;
  return `${"../".repeat(1 + depth)}BaseMobFactory`;
};
