// Installed packages
const Promise = require('bluebird');

// Our Packages
const {profileLinksScraper, profileScraper} = require('./scraper');
const {reader, writer} = require('./utils');
const {loadPeople, runCapability, runPersonPipeline} = require('./workflow/pipeline');
// logger
const logger = require('../logger')('MAIN');

const main = async page =>
  loadPeople().then(persons =>
    Promise.each(persons, async (person, index) => {
      logger.info(`Searching for index: ${index + 1}`);
      return runPersonPipeline({
        index,
        page,
        person,
        profileLinksScraper,
        profileScraper,
      }).catch(error => {
        logger.error(
          `Person pipeline failed at index ${index + 1}: ${
            error && error.stack ? error.stack : error
          }`
        );
      });
    }).then(async () => {
      const jsonData = await reader.json('tempData');
      await runCapability('EXPORT', () => writer.xlsx(jsonData));
      logger.info('COMPLETED!!!');
    })
  );

module.exports = main;
