const { exec } = require('child_process');
// "chalk": "^4.0.0",
const chalk = require('chalk');
// "ora": "^5.4.1",
const ora = require('ora');
const compressing = require('compressing');
const rimraf = require('rimraf');
const puppeteer = require('puppeteer-core');
const path = require('path');
const process = require('process');

console.log(chalk.green('nodeGit.js start...'));

const buildOra = ora().start('yarn build... \n');
let yarnBuild = exec('yarn build');
yarnBuild.stdout.on('data', (data) => {
  console.log(chalk.gray(data));
});
yarnBuild.stderr.on('data', (data) => {
  // console.log(data);
});
yarnBuild.on('close', async (code) => {
  buildOra.color = 'yellow';
  if (code === 0) {
    buildOra.succeed('Build success');
    buildNext();
  } else {
    console.log(chalk.red('Error'));
  }
});

async function buildNext() {
  await compressing.zip.compressDir('dist/', 'dist.zip', { ignoreBase: true });
  console.log(chalk.green('compress dist.zip'));
  browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    defaultViewport: {
      width: 1440,
      height: 703,
    },
    timeout: 5000,
    slowMo: 50,
    args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', '--use-gl=egl'],
  });
  let page = await browser.newPage();
  console.log(chalk.green('go to page'));
  await page.goto('http://172.18.3.2:5200');
  let input = await page.waitForSelector('form[action="/upload/nftApp"] input[type="file"]');
  await input.uploadFile(path.resolve(`${__dirname  }/dist.zip`));
  console.log(chalk.green('upload file'));
  await page.$eval('form[action="/upload/nftApp"] input[type="submit"]', (elem) => elem.click());
  console.log(chalk.green('submit'));
  await rimraf.sync('dist.zip');
  console.log(chalk.green('remove dist.zip'));
  console.log(chalk.green('nodeGit.js end...'));
  console.log(chalk.red('http://172.18.3.2:7000/'));
  console.log(chalk.green(new Date().toLocaleString()));
  process.exit();
}
