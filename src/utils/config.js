const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const yaml = require('js-yaml');

const rootDir = path.resolve(__dirname, '../..');
const configPath = path.join(rootDir, 'config', 'config.yml');

let cache;

const load = () => {
  if (!cache) {
    cache = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
  }
  return cache;
};

const reload = () => {
  cache = undefined;
  return load();
};

const get = (prop, fallback) => _.get(load(), prop, fallback);

module.exports = {
  configPath,
  get,
  load,
  reload,
  rootDir,
};
