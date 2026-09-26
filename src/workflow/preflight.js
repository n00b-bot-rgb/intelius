const fs = require('fs');

const {config, paths, WebGateway} = require('../utils');
const setup = require('./setup');

const validateFiles = (mode = 'run') => {
  const errors = [];
  const warnings = [];

  if (mode !== 'ci' && !fs.existsSync(paths.files.inputXlsx)) {
    errors.push(`Missing input workbook at ${paths.files.inputXlsx}`);
  }

  config.get('RUNTIME.REQUIRED_ENV', []).forEach(variable => {
    if (!process.env[variable] && mode !== 'ci') {
      errors.push(`Missing required environment variable: ${variable}`);
    }
  });

  if (mode === 'ci' && !fs.existsSync(paths.files.inputXlsx)) {
    warnings.push(`Skipping input workbook requirement for CI: ${paths.files.inputXlsx}`);
  }

  return {
    errors,
    warnings,
  };
};

const runPreflight = ({mode = process.env.PIPELINE_MODE || 'run'} = {}) => {
  setup();
  const validation = validateFiles(mode);
  const requireBrowser = mode !== 'ci';
  const browserRuntime = WebGateway.validateBrowserRuntime({
    requireBrowser,
  });

  return {
    browserRuntime,
    capabilities: config.get('PIPELINE.CAPABILITIES', {}),
    ...validation,
    mode,
  };
};

if (require.main === module) {
  const result = runPreflight();
  result.warnings.forEach(warning => console.warn(warning));
  if (result.errors.length > 0) {
    result.errors.forEach(error => console.error(error));
    process.exit(1);
  }
  console.log(
    `Preflight passed for ${result.mode} mode using ${
      result.browserRuntime.executablePath || 'deferred browser detection'
    }`
  );
}

module.exports = runPreflight;
