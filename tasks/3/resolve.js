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
  const splitedPath = importPath.split('/');
  const aliasPath = imports[`${splitedPath[0]}/*`];

  if (aliasPath) {
    return aliasPath.replace('*', splitedPath.slice(1).join('/'));
  }
  return importPath;
}

function resolveExtension(absolutePath) {
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

  return '';
}

function isFileExists(filePath) {
  try {
    fs.readFileSync(filePath);
    return filePath;
  } catch (err) {
    return null;
  }
}

