// Installed Packages
const csv = require('csvtojson');
const jsonfile = require('jsonfile');
const XLSX = require('xlsx');

const config = require('./config');
const paths = require('./paths');

const reader = {
  csv: (filename = 'input') =>
    csv().fromFile(paths.fromRoot('storage', `${filename}.csv`)),
  json: async (filename = 'tempData') =>
    Promise.resolve().then(() => {
      const filePath = paths.fromRoot('storage', `${filename}.json`);
      if (!require('fs').existsSync(filePath)) {
        return [];
      }
      return jsonfile.readFileSync(filePath);
    }),
  xlsx: async (filename = 'input') =>
    Promise.resolve().then(() => {
      const workbook = XLSX.readFile(
        paths.fromRoot('storage', `${filename}.xlsx`),
        {
        dateNF: 'dd/mm/yyyy',
        cellDates: true,
        }
      );
      const sheet_name_list = workbook.SheetNames;
      return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    }),
  yaml: () => config.load(),
};

module.exports = reader;
