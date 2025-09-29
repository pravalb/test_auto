const { config } = require('dotenv');

const env = process.env.TEST_ENV || 'test';
config({ path : `.env.${env}` });

module.exports = {
  testDir: 'tests',
  timeout: 60000,
  retries: 0,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'result.xml'}],
    ['allure-playwright']
  ],
  globalSetup: './global-setup.js',
  globalTearDown: './global-teardown.js',
   projects: [
    {
      name: 'Chrome',
      use: {
        browserName: "chromium",
        channel: 'chrome',
        headless: true,
       // viewport: { width: 1720, height: 850 },
        viewport: { width: 1600, height: 850 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
      
    },
    // {
    //   name: 'Firefox',
    //   use: {
    //     browserName: "firefox",
    //     channel: 'chrome',
    //     headless: true,
    //     viewport: { width: 1720, height: 850 },
    //     screenshot: 'only-on-failure',
    //     video: 'retain-on-failure',
    //     trace: 'retain-on-failure'
    //   }
    // },
    // {
    //   name: 'Safari',
    //   use: {
    //     browserName: "safari",
    //     headless: true,
    //     viewport: { width: 1720, height: 850 },
    //     screenshot: 'only-on-failure',
    //     video: 'retain-on-failure',
    //     trace: 'retain-on-failure'
    //   }
    // },
  ]
};
