const path = require('path');

const config = require('./config');

const fromRoot = (...segments) => path.join(config.rootDir, ...segments);

const resolveConfiguredPath = configKey => fromRoot(...config.get(configKey).split('/'));

const directories = {
  backup: resolveConfiguredPath('PATHS.DIRECTORIES.BACKUP'),
  logs: resolveConfiguredPath('PATHS.DIRECTORIES.LOGS'),
  playground: resolveConfiguredPath('PATHS.DIRECTORIES.PLAYGROUND'),
  screenshots: resolveConfiguredPath('PATHS.DIRECTORIES.SCREENSHOTS'),
  storage: resolveConfiguredPath('PATHS.DIRECTORIES.STORAGE'),
};

const files = {
  inputXlsx: resolveConfiguredPath('PATHS.FILES.INPUT_XLSX'),
  outputCsv: resolveConfiguredPath('PATHS.FILES.OUTPUT_CSV'),
  outputXlsx: resolveConfiguredPath('PATHS.FILES.OUTPUT_XLSX'),
  tempDataJson: resolveConfiguredPath('PATHS.FILES.TEMP_DATA_JSON'),
};

module.exports = {
  directories,
  files,
  fromRoot,
  rootDir: config.rootDir,
};
