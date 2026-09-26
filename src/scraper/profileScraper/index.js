// Our Packages
const matchAddress = require('./matchAddress');
const scrapeProfile = require('./scrape');
const {reader} = require('../../utils');
const {normalizeProfileMatches} = require('../../workflow/normalize');
// logger
const logger = require('../../../logger')('PROFILE_SCRAPER');

const profileScraper = async (page, link, person) => {
  logger.info('Start');
  await page.goto(link);
  logger.info('Profile Page loaded');

  const htmlContent = await page.content();
  const profile = await scrapeProfile(htmlContent);
  logger.info('Profile Scraped');

  const addressKey = reader.yaml().XLSX.ADDRESS;
  const ADDRESS = person[addressKey].split(' ')[0];
  if (!matchAddress(profile.address, ADDRESS)) {
    return [];
    logger.info('End');
  }

  logger.info('Matching Address Found');
  logger.info(`personProfile: ${JSON.stringify(profile)}`);
  const arr = normalizeProfileMatches(person, profile);
  logger.info(`normalizedProfiles: ${arr.length}`);
  logger.info('End');
  return arr;
};

module.exports = profileScraper;
