# performance-leaderboard-pagespeed-insights

A plugin to run Lighthouse (on PageSpeed Insights) against a set of urls to see which site is the fastest.

* See also: [`performance-leaderboard`](https://github.com/zachleat/performance-leaderboard/) (which runs Lighthouse locally)

## Installation

```sh
npm install performance-leaderboard-pagespeed-insights
```

## Features

* This plugin only runs one test against the PageSpeed Insights API per URL. In contrast, `performance-leaderboard` offers a configurable number of runs per URL and selects the median.

## Usage

1. Create a test file, say `sample.js`:

```js
const PerfLeaderboard = require("performance-leaderboard-pagespeed-insights");

(async function() {

	let urls = [
		"https://www.gatsbyjs.org/",
		"https://nextjs.org/",
		"https://www.11ty.dev/",
		"https://vuejs.org/",
		"https://reactjs.org/",
		"https://jekyllrb.com/",
		"https://nuxtjs.org/",
		"https://gohugo.io/",
	];

	// Create the options object (not required)
	const options = {
		axePuppeteerTimeout: 30000, // 30 seconds
		writeLogs: true, // Store audit data
		logDirectory: '.log', // Default audit data files stored at `.log`
		readFromLogDirectory: false, // Skip tests with existing logs
	}

	console.log( await PerfLeaderboard(urls) );
})();
```

2. Run `node sample.js`.

<details>
<summary>Sample Output</summary>

```js
[
	{
		url: 'https://www.11ty.dev/',
		requestedUrl: 'https://www.11ty.dev/',
		timestamp: 1623525988492,
		ranks: { hundos: 1, performance: 1, accessibility: 1, cumulative: 1 },
		lighthouse: {
			version: '8.0.0',
			performance: 1,
			accessibility: 1,
			bestPractices: 1,
			seo: 1,
			total: 400
		},
		firstContentfulPaint: 1152.3029999999999,
		firstMeaningfulPaint: 1152.3029999999999,
		speedIndex: 1152.3029999999999,
		largestContentfulPaint: 1152.3029999999999,
		totalBlockingTime: 36,
		cumulativeLayoutShift: 0.02153049045138889,
		timeToInteractive: 1238.3029999999999,
		maxPotentialFirstInputDelay: 97,
		timeToFirstByte: 54.63900000000001,
		weight: {
			summary: '14 requests • 178 KiB',
			total: 182145,
			image: 124327,
			imageCount: 10,
			script: 7824,
			scriptCount: 1,
			document: 30431,
			font: 15649,
			fontCount: 1,
			stylesheet: 3914,
			stylesheetCount: 1,
			thirdParty: 15649,
			thirdPartyCount: 1
		},
		run: { number: 2, total: 3 },
		axe: { passes: 850, violations: 0 },
	}
]
```

</details>

## Rankings

In the return object you’ll see a `ranks` object listing how this site compares to the other sites in the set. There are a bunch of different scoring algorithms you can choose from:

* `ranks.performance`
	* The highest Lighthouse performance score.
	* Tiebreaker given to the lower SpeedIndex score.
* `ranks.accessibility`
	* The highest Lighthouse accessibility score.
	* Tiebreaker given to lower Axe violations.
	* Second tiebreaker given to highest Axe passes (warning: each instance of an Axe rule passing is treated separately so this will weigh heavily in favor of larger pages)
* `ranks.hundos`
	* The sum of all four Lighthouse scores.
	* Tiebreaker given to the lower Speed Index / Total Page Weight ratio.
* `ranks.cumulative` (the same as `hundos` but with an Axe tiebreaker)
	* The sum of all four Lighthouse scores.
	* Tiebreaker given to the lower Axe violations.
	* Second tiebreaker given to the lower Speed Index / Total Page Weight ratio.

## Changelog

* `v9.6.6` Initial release.
