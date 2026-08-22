import fs from "node:fs";
import path from "node:path";

const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const { imports } = packageJSON;
const rootDir = path.resolve(".");

const extensionsToResolve = ["js", "ts", "json"];

export function resolve(importPath, parentPath) {
  if (importPath.startsWith("#")) {
    return isFileExists(resolveExtension(resolveAlias(importPath)));
  }

  const parentDir = path.dirname(parentPath);
  const absolutePath = path.resolve(parentDir, importPath);

  return isFileExists(resolveExtension(absolutePath));
}

function resolveAlias(importPath) {
  const aliasedPath = getAlias(importPath);

  if (aliasedPath) {
    return path.resolve(rootDir, aliasedPath);
  }
  return null;
}

function getAlias(importPath) {
  for (const [aliasPattern, targetPattern] of Object.entries(imports)) {
    const aliasPrefix = aliasPattern.split("*")[0];
    const targetPrefix = targetPattern.split("*")[0];

    if (importPath.startsWith(aliasPrefix)) {
      return importPath.replace(aliasPrefix, targetPrefix);
    }
  }
}

function resolveExtension(absolutePath) {
  if (!absolutePath) {
    return absolutePath;
  }
  const extention = path.extname(absolutePath);
  if (extention) {
    return absolutePath;
  } else {
    for (const ext of extensionsToResolve) {
      const resultPath = `${absolutePath}.${ext}`;
      if (isFileExists(resultPath)) {
        return resultPath;
      }
    }
  }

  return null;
}

function isFileExists(filePath) {
  try {
    fs.readFileSync(filePath);
    return filePath;
  } catch (err) {
    return null;
  }
}

