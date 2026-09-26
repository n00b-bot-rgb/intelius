const logger = require('../../logger')('PIPELINE');

const {config, helper, reader, writer} = require('../utils');
const {rowSeparator} = require('./normalize');

const capabilityMap = config.get('PIPELINE.CAPABILITIES', {});

const describeCapability = capabilityName => capabilityMap[capabilityName] || {};

const runCapability = async (capabilityName, operation) => {
  const capability = describeCapability(capabilityName);
  logger.info(
    `${capabilityName} start | inputs=${JSON.stringify(
      capability.INPUTS || []
    )} outputs=${JSON.stringify(capability.OUTPUTS || [])}`
  );
  try {
    const result = await operation();
    logger.info(`${capabilityName} end`);
    return result;
  } catch (error) {
    logger.error(
      `${capabilityName} failed: ${error && error.stack ? error.stack : error}`
    );
    throw error;
  }
};

const loadPeople = async () => runCapability('INPUT_MAPPING', () => reader.xlsx('input'));

const appendSeparator = async () => writer.json(rowSeparator, 'tempData');

const runPersonPipeline = async ({
  page,
  person,
  index,
  profileLinksScraper,
  profileScraper,
}) => {
  logger.info(`Starting person pipeline for index ${index + 1}`);
  if (!helper.isSearchable(person)) {
    logger.info(`Not Searchable Person: ${JSON.stringify(person)}`);
    return {
      matched: false,
      skipped: true,
    };
  }

  const profileLinks = await runCapability('PROFILE_LINK_DISCOVERY', () =>
    profileLinksScraper(page, person)
  );
  logger.info(`profileLinks: ${profileLinks.length}`);

  let matched = false;
  for (const link of profileLinks) {
    try {
      const arr = await runCapability('PROFILE_ENRICHMENT', () =>
        profileScraper(page, link, person)
      );
      await helper.throttle();
      if (arr.length > 0) {
        matched = true;
        await writer.json(arr, 'tempData');
      }
    } catch (error) {
      logger.error(
        `Profile enrichment failed for ${link}: ${
          error && error.stack ? error.stack : error
        }`
      );
    }
  }

  if (matched) {
    await appendSeparator();
  }

  return {
    matched,
    skipped: false,
  };
};

module.exports = {
  loadPeople,
  runCapability,
  runPersonPipeline,
};
