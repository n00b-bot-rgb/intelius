require('dotenv').config();

// Our Packages
const login = require('./login');
const main = require('./main');
const {helper, WebGateway} = require('./utils');
const runPreflight = require('./workflow/preflight');
const setup = require('./workflow/setup');
const {runCapability} = require('./workflow/pipeline');
// logger
const logger = require('../logger')('APP');

if (require.main === module) {
  logger.info('Starting App');
  (async () => {
    let browser;
    logger.info('Starting Main function');
    try {
      setup();
      const preflight = runPreflight();
      preflight.warnings.forEach(warning => logger.warn(warning));
      if (preflight.errors.length > 0) {
        throw new Error(preflight.errors.join('\n'));
      }
      browser = await WebGateway.browser();
      const page = await WebGateway.page(browser);
      await runCapability('LOGIN', () => login(page));
      await helper.backupFile('tempData.json');
      await helper.backupFile('out.xlsx');
      await main(page);
    } catch (e) {
      logger.error(e && e.stack ? e.stack : e);
      process.exitCode = 1;
    } finally {
      logger.info('Ending Main function');
      if (browser) {
        await browser.close();
      }
    }
  })();
  logger.info('Ending App');
}
