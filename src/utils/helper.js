// System packages
const fs = require('fs');

// Installed packages
const _ = require('lodash');

// Our Packages
const config = require('./config');
const reader = require('./reader');
const {emptyPerson, rowSeparator} = require('../workflow/normalize');
const paths = require('./paths');

const isSearchable = obj => {
  const ADDRESS = reader.yaml().XLSX.ADDRESS;
  const CITY = reader.yaml().XLSX.CITY;
  const STATE = reader.yaml().XLSX.STATE;
  return !(
    _.isEmpty(obj[ADDRESS]) ||
    _.isEmpty(obj[CITY]) ||
    _.isEmpty(obj[STATE])
  );
};

const timeoutPromise = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const throttle = () => {
  const randomNum = Math.floor(Math.random() * 5) + 1;
  return timeoutPromise(config.get('RUNTIME.THROTTLE_MULTIPLIER_MS', 500) * randomNum);
};

const backupFile = async fileName => {
  const FILENAME = paths.fromRoot('storage', fileName);
  if (fs.existsSync(FILENAME)) {
    const COPY_FILENAME = paths.fromRoot(
      'storage',
      'backup',
      `${fileName}.${Date.now()}.bak`
    );
    fs.copyFileSync(FILENAME, COPY_FILENAME);
    fs.unlinkSync(FILENAME);
  }
};

module.exports = {
  isSearchable,
  backupFile,
  emptyPerson,
  rowSeparator,
  timeoutPromise,
  throttle,
};
