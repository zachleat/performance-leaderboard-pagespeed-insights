const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function(pageUrl) {
	// LIMITS https://stackoverflow.com/questions/37122041/pagespeed-insights-api-limits
  let fetchUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=accessibility&category=best-practices&category=performance&category=seo&url=${encodeURIComponent(pageUrl)}`;

  return EleventyFetch(fetchUrl, {
    duration: "0s",
    type: "json"
  });
};