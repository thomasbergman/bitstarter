#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
  var instr = infile.toString();
  if(!fs.existsSync(instr)) {
    console.log("%s does not exist. Exiting.", instr);
    process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
  }
  return instr;
};

var cheerioFromString = function(string) {
  return cheerio.load(string);
};

var cheerioHtmlFile = function(htmlfile) {
  return cheerioFromString(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile));
};

var getRemote = function(url, afterReceive) {
  var responseBody = function(result, response) {
    if (result instanceof Error) {
      console.error('Error: ' + util.format(response.message));
    } else {
      afterReceive(result.toString());
    }
  };
  rest.get(url).on('complete', responseBody);
}

var checkHtmlFile = function(htmlfile, checksfile) {
  $ = cheerioHtmlFile(htmlfile);
  var checks = loadChecks(checksfile).sort();
  var out = {};
  for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  return out;
};

var checkRemote = function(url, checksfile) {
  getRemote(url, function (body) {
    $ = cheerioFromString(body);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
      var present = $(checks[ii]).length > 0;
      out[checks[ii]] = present;
    }
    var outJson = JSON.stringify(out, null, 2);
    console.log(outJson);
  });
};

var clone = function(fn) {
  // Workaround for commander.js issue.
  // http://stackoverflow.com/a/6772648
  return fn.bind({});
};

if(require.main == module) {
  program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-u, --url <url>', 'URL to index.html')
    .parse(process.argv);

  checkRemote(program.url, program.checks);
} else {
  exports.checkRemote = checkRemote;
}
