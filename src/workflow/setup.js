const fs = require('fs');

const {directories} = require('../utils/paths');

const ensureDirectory = directory => {
  fs.mkdirSync(directory, {
    recursive: true,
  });
};

const setup = () => {
  Object.values(directories).forEach(ensureDirectory);
  return directories;
};

if (require.main === module) {
  setup();
}

module.exports = setup;
