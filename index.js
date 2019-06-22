/* eslint-disable no-inner-declarations */
const puppeteer = require("puppeteer");

const { closeBrowser } = require("./utils");
const { goToUrl, goToOddsTab } = require("./navigation");
const { scrapOdds } = require("./fetches/getMatchFixtures");
const { fetchStandings } = require("./fetches/getMatchStandings");

const rootUrl = "https://www.flashscore.com";

(async () => {
	const { browser, page } = await startBrowser();

	await goToUrl(page, rootUrl);
	await goToOddsTab(page);
	const matchFixures = await scrapOdds(page);

	await fetchStandings(browser, matchFixures);

	/* close browser*/
	// await closeBrowser(browser);
})();

async function startBrowser() {
	const browser = await puppeteer.launch({
		headless: false
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1920,
		height: 1080
	});

	// block image fetching so speed up data fetches
	await page.setRequestInterception(true);
	page.on("request", req => {
		if (req.resourceType() == "font" || req.resourceType() == "image") {
			req.abort();
		} else {
			req.continue();
		}
	});

	return {
		browser,
		page
	};
}
