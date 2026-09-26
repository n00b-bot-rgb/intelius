// Installed Packages
const fs = require('fs');
const puppeteer = require('puppeteer');

// Our Packages
const config = require('./config');
const BrowserLogger = require('../../logger')('BROWSER');
const PageLogger = require('../../logger')('PAGE');

const browserCandidates = () =>
  [
    process.env[config.get('RUNTIME.BROWSER_EXECUTABLE_ENV', 'PUPPETEER_EXECUTABLE_PATH')],
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);

const getBundledExecutablePath = () => {
  try {
    return puppeteer.executablePath();
  } catch (error) {
    return undefined;
  }
};

const resolveExecutablePath = () => {
  const detectedPath = browserCandidates().find(candidate => fs.existsSync(candidate));
  if (detectedPath) {
    return detectedPath;
  }
  const bundledPath = getBundledExecutablePath();
  return bundledPath && fs.existsSync(bundledPath) ? bundledPath : undefined;
};

const validateBrowserRuntime = ({requireBrowser = true} = {}) => {
  const executablePath = resolveExecutablePath();
  if (requireBrowser && !executablePath) {
    throw new Error(
      'No browser executable available. Set PUPPETEER_EXECUTABLE_PATH or install Chromium.'
    );
  }
  return {
    executablePath,
  };
};

const browser = async () => {
  BrowserLogger.info('Start');
  const {executablePath} = validateBrowserRuntime();
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV !== 'debug',
    args: ['--start-fullscreen', '--incognito'],
    executablePath,
  });
  BrowserLogger.info('Puppeteer launch');
  BrowserLogger.info('End');
  return browser;
};

const page = async browser => {
  PageLogger.info('Start');
  const page = await browser.newPage();
  PageLogger.info('New page');
  page.setDefaultNavigationTimeout(60 * 1000);
  page.setJavaScriptEnabled(true);
  PageLogger.info('End');
  return page;
};

module.exports = {
  browser,
  page,
  validateBrowserRuntime,
};
