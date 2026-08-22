import fs from "node:fs";
import path from "node:path";

import { resolve } from "../3/resolve.js";
/**
 * Примерный алгоритм работы бандлера:
 * 1. Прочитать entry и собрать список всех вызовов require
 * 2. Пройтись по полученным require (они могут быть вложенными)
 * 3. На выходе получится массив с исходным кодом всех модулей
 * 4. Склеить всё воедино обернув модули и entry в новый рантайм
 * 
 * Для чтения файлов используйте fs.readFileSync
 * Для резолва пути до модуля испльзуйте path.resolve (вам нужен путь до родителя где был вызван require)
 * Пока что сборщик упрощен, считаем что require из node_modules нет
 */

/**
 * @param {string} entryPath - путь к entry бандлинга
 */
export function bundle(entryPath) {
  const entryContent = fs.readFileSync(entryPath, "utf-8");
  const requireCalls = searchRequireCalls(entryContent).map((modulePath) => ({
    modulePath: resolve(modulePath, entryPath),
    moduleId: modulePath,
    parent: entryPath,
  }));

  const modules = [];

  while (requireCalls.length !== 0) {
    const { modulePath, moduleId, parent } = requireCalls.pop();
    let finalModulePath;

    if (path.isAbsolute(modulePath)) {
      finalModulePath = modulePath;
    } else {
      finalModulePath = path.resolve(path.dirname(parent), modulePath);
    }

    const moduleCode = fs.readFileSync(finalModulePath, 'utf-8');

    if (finalModulePath.endsWith('.json')) {
      moduleCode = `module.exports = ${moduleCode}`;
    } else {
      const moduleRequireCalls = searchRequireCalls(moduleCode);

      if (moduleRequireCalls.length) {
        requireCalls.push(
          ...moduleRequireCalls.map((newModulePath) => ({
            modulePath: resolve(newModulePath, finalModulePath),
            moduleId: newModulePath,
            parent: finalModulePath,
          }))
        );
      }
    }

    modules.push(`modules['${moduleId}'] = function (require, module) {
${moduleCode}
    };`);
  }

  const header = `
  var modules = {};
  function require(name) {
    modules[name](require, modules[name]);
    return modules[name].exports;
  }`;
  const entry = `
  (function(require, module) { ${entryContent} })(require, modules)
  `;

  const result = `${header}\n${modules.join("\n")}\n${entry}`;
  return result;
}

/**
 * Функция для поиска в файле вызовов require
 * Возвращает id модулей
 * @param {string} code 
 */
function searchRequireCalls(code) {
  return [...code.matchAll(/require\(('|")(.*)('|")\)/g)].map(
    (item) => item[2]
  );
}
