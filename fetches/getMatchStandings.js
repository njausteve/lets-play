const { goToUrl } = require("../navigation");
const { sleep } = require("../utils");
const queue = require("async/queue");

async function fetchStandings(browser, matchFixtures) {
	async function getStandings(matchFixture, callback) {
		// console.log("matchFixture", matchFixture); // eslint-disable-line no-console
		try {
			const page = await browser.newPage();
			const matchId = matchFixture.matchId;
			const matchSummaryUrl = `https://www.flashscore.com/match/${matchId}/#match-summary`;

			await page.goto(matchSummaryUrl);

			// console.log(
			// 	matchFixture.homeTeam,
			// 	"vs",
			// 	matchFixture.awayTeam,
			// 	"on summary page"
			// );


			/* wait for summary page to load*/
			const tabsWrapperSelector = "#detail-mainmenu-bookmark > ul";
			await page.waitFor(tabsWrapperSelector);

			// console.log(
			// 	matchFixture.homeTeam,
			// 	"vs",
			// 	matchFixture.awayTeam,
			// 	"done awaiting match summary tabs"
			// );

			await page.waitFor(3000);

			/* check if match summary page has matchStandings Tab */
			matchFixture.summaryTabs = await page.evaluate(async () => {
				const standingsTabSelector = "#a-match-standings";
				const matchSummaryTabSelector = "#a-match-summary";
				const matchH2HTabSelector = "#a-match-head-2-head";

				return {
					standings: await document.querySelector(standingsTabSelector) !== null,
					matchSummary: await document.querySelector(matchSummaryTabSelector) !== null,
					matchH2H: await document.querySelector(matchH2HTabSelector) !== null
				};

			});

			console.log("matchFixture", matchFixture);


			/* go to match standings table if available */
			if(matchFixture.summaryTabs.standings) {
				await goToTab(page, "#a-match-standings", ".highlight");
			} else {

				callback();
				await page.close();
			}


		} catch (error) {
			console.log("error", error); // eslint-disable-line no-console
		}
	}

	try {
		let q = queue((task, callback) => {
			getStandings(task, callback);
			// console.log("Hello " + task); // eslint-disable-line no-console
		}, 10);

		// assign a callback
		q.drain = function() {
			console.log("All items have been processed"); // eslint-disable-line no-console
		};

		// assign an error callback
		q.error(function(err, task) {
			console.error("task experienced an error", err, task); // eslint-disable-line no-console
		});

		// add some items to the queue
		q.push(matchFixtures, function() {
			console.log("Finished processing item"); // eslint-disable-line no-console
		});
	} catch (error) {
		console.log("error", error); // eslint-disable-line no-console
	}
}


async function goToTab(page, tabSelector, selectorToWaitFor) {
	try {
		await page.waitFor(tabSelector);
		await page.click(tabSelector);

		await page.waitFor(selectorToWaitFor);
		await sleep(5000);
	} catch (error) {
		console.log("error", error); // eslint-disable-line no-console
	}
}

module.exports = {
	fetchStandings
};
