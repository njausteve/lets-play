const { sleep } = require("./utils");

async function goToUrl(page, url) {
	page.goto(url, {
		waitUntil: "networkidle2"
	});
}

async function goToOddsTab(page) {
	try {
		const oddsTabSelector = "#live-table > div.tabs > ul > li:nth-child(5)";

		await page.waitFor(oddsTabSelector);
		await page.click(oddsTabSelector);

		await page.waitFor(".odds__odd--betslip, .event__scores span");
		await sleep(5000);
	} catch (error) {
		console.log("error", error); // eslint-disable-line no-console
	}
}

module.exports = {
	goToUrl,
	goToOddsTab
};
