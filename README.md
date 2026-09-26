# Synopsis

The objective of the project is to scrap the user phone number, email and address details of every search.

## Technologies

1. puppeteer
2. cheerio
3. csv-writer
4. csvtojson

## Installation

1. Install Node.js and Yarn.
2. Install the project dependencies. Puppeteer `1.14.0` depends on a Chromium snapshot that is no longer downloadable, so skip the bundled download and point the scraper at a locally installed Chrome/Chromium binary.
```bash
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 yarn install
```
3. Export the browser executable path if Chromium is not auto-detected.
```bash
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```
4. Create the workflow directories.
```bash
yarn setup
```

## Run

1. Add email and password of Intelius login in `.env` file in the repository root.
```bash
email=""
password=""
```
2. Place the source workbook at `/home/runner/work/intelius/intelius/storage/input.xlsx`.
3. Run preflight checks.
```bash
yarn preflight
```
4. Start the workflow.
```bash
yarn workflow
```

## Workflow Pipeline

The scraper now executes a staged pipeline with explicit capability boundaries:

1. `PREFLIGHT` validates configuration, directories, browser runtime, and required inputs.
2. `LOGIN` authenticates into Intelius.
3. `INPUT_MAPPING` reads `/home/runner/work/intelius/intelius/storage/input.xlsx` using the schema defined in `/home/runner/work/intelius/intelius/config/config.yml`.
4. `PROFILE_LINK_DISCOVERY` searches Intelius and collects matching result links.
5. `PROFILE_ENRICHMENT` scrapes phones, emails, and addresses into a normalized intermediate JSON file.
6. `EXPORT` writes `/home/runner/work/intelius/intelius/storage/out.xlsx`.

## Commands

```bash
yarn setup         # create logs/, screenshots/, storage/, storage/backup/, playground/
yarn preflight     # validate runtime requirements for local scraping
yarn preflight:ci  # validate the pipeline in CI mode
yarn validate      # setup + CI-safe preflight validation
yarn workflow      # setup + preflight + run the scraper
```

## Contributors

**Ajan Lal Shrestha**

ajan.shresh@gmail.com

## License

Copyright (C) 2019
