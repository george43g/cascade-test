/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
// eslint-disable-next-line spaced-comment
/// <reference types="webpack" />
const { writeFileSync } = require('fs');
const { resolve } = require('path');
const _ = require('lodash');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {
  exportFunctions,
  funcNameFromRelPathDefault,
} = require('better-firebase-functions');
const { execSync } = require('child_process');
// const webpack = require('webpack');
// class RunShellPlugin extends webpack.Plugin {
//   apply(compiler) { }
// }

// eslint-disable-next-line no-unused-vars
class RunShellPlugin {
  constructor(command) {
    this.command = command;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('RunShellPlugin', () => {
      let resultBuffer;
      try {
        resultBuffer = execSync(this.command);
      } catch (err) {
        process.stderr.write(err);
      }
      process.stdout.write(resultBuffer);
    });
  }
}

class GenerateFunctionsPackagePlugin {
  constructor(funcConfigPath, outputDir) {
    this.outputDir = outputDir;
    let funcConfig;
    try {
      funcConfig = require(funcConfigPath);
    } catch (e) {
      throw new Error(
        `functions.config.json error: please ensure file is complete and in sourceRoot ${e}`
      );
    }
    const { dependencies, outputEntryFilename } = funcConfig;
    this.dependencyArray = dependencies || [];
    this.outputEntryFilename = outputEntryFilename || 'main.js';
    process.stdout.write(
      `Package.json Dependencies: "${this.dependencyArray.join('", "')}".\n`
    );
  }

  writePackage() {
    const packageJson = require(resolve(process.cwd(), './package.json'));
    const functionsPackageJson = {
      name: 'cloud-functions',
      engines: { node: '10' },
      main: this.outputEntryFilename,
      dependencies: this.dependencyArray.reduce((acc, cur) => {
        acc[cur] = packageJson.dependencies[cur];
        return acc;
      }, {}),
    };

    writeFileSync(
      resolve(this.outputDir, './package.json'),
      JSON.stringify(functionsPackageJson, undefined, 4)
    );
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('GenerateFunctionsPackagePlugin', () => {
      try {
        this.writePackage();
      } catch (err) {
        process.stderr.write(err);
      }
    });
  }
}

module.exports = (config, context) => {
  const {
    options: { outputPath: outputDir, main, root, sourceRoot },
  } = context;
  const absSourceRoot = path.resolve(root, sourceRoot);
  const funcConfigPath = path.resolve(absSourceRoot, 'functions.config.json');
  const {
    functionDirectoryPath,
    searchGlob,
    outputEntryFilename,
  } = require(funcConfigPath);

  /* TODO: These should just be webpack plugins - release all of these as a package for wider use.
  The whole thing can be either bff or without (package gen)
  ? You would include the schematic
  * how i build a two sided marketplace on firebase in two years - how i started a company with 300k
  * yearly turnover at 16 -- why australian domestic violence wont change
  */

  const customConfig = {
    plugins: [
      new CleanWebpackPlugin(),
      // new RunShellPlugin(command),
      new GenerateFunctionsPackagePlugin(funcConfigPath, outputDir),
    ],
    output: {},
  };

  // * Output file names
  customConfig.output.filename = function chunkDataToFileName(chunkData) {
    const { name } = chunkData.chunk;
    if (name === 'main') return outputEntryFilename;
    return `${name.split('-').join('/')}.js`;
  };

  // * Entry point logic
  const generateEntryObj = (funcExports) => {
    const output = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(funcExports)) {
      if (typeof funcExports[key] === 'string') {
        const newKey = funcNameFromRelPathDefault(funcExports[key]);
        output[newKey] = path.resolve(
          absSourceRoot,
          functionDirectoryPath,
          funcExports[key]
        );
      } else {
        const subModulePaths = generateEntryObj(funcExports[key]);
        Object.assign(output, subModulePaths);
      }
    }
    return output;
  };

  const exportsObj = exportFunctions({
    searchGlob,
    functionDirectoryPath,
    __filename: main,
    exports: {},
    exportPathMode: true,
  });

  customConfig.entry = generateEntryObj(exportsObj);

  return _.merge(config, customConfig);
};
