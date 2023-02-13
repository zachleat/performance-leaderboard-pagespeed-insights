const slugify = require("slugify");
const ResultLogger = require("./src/ResultLogger");
const writeLog = require("./src/WriteLog");
const readLog = require("./src/ReadLog");
const LighthousePagespeedInsights = require("./src/LighthousePagespeedInsights");

const LOG_DIRECTORY = ".log";
const AXE_PUPPETEER_TIMEOUT = 30000;

slugify.extend({":": "-", "/": "-"});

async function runLighthouse(urls, options = {}) {
  let opts = Object.assign({
    writeLogs: true,
    logDirectory: LOG_DIRECTORY,
    readFromLogDirectory: false,
    axePuppeteerTimeout: AXE_PUPPETEER_TIMEOUT,
    bypassAxe: [], // skip axe checks
    // callback before each lighthouse test
    beforeHook: function(url) {}, // async compatible
    // callback after each lighthouse result
    afterHook: function(result) {}, // async compatible
    // deprecated
    resultHook: function(result) {}, // async compatible
  }, options);

  let resultLog = new ResultLogger();
  resultLog.logDirectory = opts.logDirectory;
  resultLog.writeLogs = opts.writeLogs;
  resultLog.readFromLogs = opts.readFromLogDirectory;
  resultLog.axePuppeteerTimeout = opts.axePuppeteerTimeout;
  resultLog.bypassAxe = opts.bypassAxe;

  console.log( `Testing ${urls.length} site${urls.length !== 1 ? "s" : ""}:` );

  let count = 0;
  let promises = [];

  for(let url of urls) {
    try {
      promises.push(new Promise(async (resolve) => {
        console.log( `(Site ${++count} of ${urls.length}): ${url}` );

        if(opts.beforeHook && typeof opts.beforeHook === "function") {
          await opts.beforeHook(url);
        }

        let filename = `lighthouse-${slugify(url)}.json`;
        let rawResult;
        if(opts.readFromLogDirectory) {
          rawResult = readLog(filename, opts.logDirectory);
        } else {
          rawResult = await LighthousePagespeedInsights(url).then(result => result.lighthouseResult);

          if(opts.writeLogs) {
            await writeLog(filename, rawResult, opts.logDirectory);
          }
        }

        let afterHook = opts.afterHook || opts.resultHook; // resultHook is deprecated (renamed)
        if(afterHook && typeof afterHook === "function") {
          await afterHook(resultLog.mapResult(rawResult), rawResult);
        }

        resultLog.add(url, rawResult);

        resolve();
      }));
    } catch(e) {
      console.log( `Logged an error with ${url}: `, e );
      resultLog.addError(url, e);
    }
  }

  await Promise.all(promises);

  return await resultLog.getFinalSortedResults();
}

module.exports = runLighthouse;
