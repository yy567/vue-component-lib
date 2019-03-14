/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const uppercamelcase = require('uppercamelcase');
const packageJson = require('../package.json');
const components = require('./get-components')();

const outPath = path.resolve(__dirname, '../src');

const scriptContent = `// This file is auto gererated by build/build-entry.js
import { VueConstructor } from 'vue';
${components.map(name => `import ${uppercamelcase(name)} from './packages/${name}';`).join('\n')}

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

const components = [
  ${components.map(item => uppercamelcase(item)).join(',\n  ')},
];
const version = '${process.env.VERSION || packageJson.version}';

const install = (Vue: VueConstructor) => {
  components.forEach((component) => {
    Vue.use(component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  version,
  ${components.map(item => uppercamelcase(item)).join(',\n  ')},
};

export default {
  install,
  version,
};
`;

const styleContent = `// This file is auto gererated by build/build-entry.js

// global and base styles
@import "style/global";
@import "base";

// component styles
${components.map(name => `@import "./packages/${name}";`).join('\n')}
`;

fs.writeFileSync(outPath.concat('/index.ts'), scriptContent);
fs.writeFileSync(outPath.concat('/index.scss'), styleContent);

// eslint-disable-next-line no-octal-escape
console.log('\033[42;30m DONE \033[40;32m build entry files completed...\033[0m');
