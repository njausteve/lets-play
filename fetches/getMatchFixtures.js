const fs = require("fs");

async function scrapOdds(page) {
	try {
		const results = await page.evaluate(async () => {
			let data = [];
			await fetcEachhMatchData();

			async function fetcEachhMatchData() {
				const leagueTitleSelector =
					"#live-table > div.event.odds > div.event.odds > div";
				const headerSelector = "event__header";

				const leagueRows = [...document.querySelectorAll(leagueTitleSelector)];
				const headerIndexes = leagueRows
					.map((e, i) => (isHeader(e, headerSelector) ? i : ""))
					.filter(String);

				for (const [index, row] of leagueRows.entries()) {
					// Loop through each proudct
					if (!isHeader(row, headerSelector)) {
						// Push an object with the data onto our array
						data.push({
							...matchHeader(index, headerIndexes, leagueRows),
							...matchNames(row),
							...matchDetails(row),
							matchResults: matchResults(row),
							status: getMatchStatus(row),
							startTime: getMatchStartTime(row),
							odds: matchOdds(row),
							matchId: getMatchId(row)
						});
					}
				}
			}

			function getMatchId(row) {
				return row.id.replace(/g_1_/g, "");
			}

			function isHeader(row, headerSelector) {
				return row.classList.contains(headerSelector);
			}

			function rowContains(row, selector) {
				if (row.querySelectorAll(selector).length === 0) {
					return false;
				}
				return true;
			}

			function toNumber(value) {
				return typeof value === "string" ? Number(value) : 0;
			}

			function matchHeader(itemIndex, headerIndexes, leagueRows) {
				const rowHeaderIndex = headerIndexes.reduce((prevIndex, currIndex) =>
					itemIndex > currIndex ? currIndex : prevIndex
				);

				let leagueName = leagueRows[rowHeaderIndex].querySelector(
					".event__title--name"
				).innerHTML;
				let country = leagueRows[rowHeaderIndex]
					.querySelector("span:nth-child(1)")
					.innerHTML.replace(/:&nbsp;/g, "");

				return {
					leagueName,
					country
				};
			}

			function matchOdds(row) {
				if (!rowContains(row, ".odds__odd--betslip")) {
					return {
						home: 0,
						draw: 0,
						away: 0
					};
				}
				const allOdd = row.querySelectorAll(".odds__odd--betslip span");
				return {
					home: toNumber(allOdd[0].childNodes[0].nodeValue),
					draw: toNumber(allOdd[1].childNodes[0].nodeValue),
					away: toNumber(allOdd[2].childNodes[0].nodeValue)
				};
			}

			function matchNames(row) {
				const homeTeamSelector = ".event__participant--home";
				const awayTeamSelector = ".event__participant--away";

				const homeTeam = row.querySelector(homeTeamSelector).childNodes[0]
					.nodeValue;
				const awayTeam = row.querySelector(awayTeamSelector).childNodes[0]
					.nodeValue;

				return {
					homeTeam,
					awayTeam
				};
			}

			// TODO: Finish status evaluation from data
			function getMatchStatus(row) {
				const matchStatusSelector = ".event__stage";
				const ongoingMatchSelector = ".event__stage--block";

				if (
					rowContains(row, matchStatusSelector) &&
					!rowContains(row, ongoingMatchSelector)
				) {
					return row.querySelector(matchStatusSelector).childNodes[0].nodeValue;
				} else {
					return "not now";
				}

				// if (rowContains(row, ongoingMatchSelector)) {
				// 	return "ongoing";
				// }

				// return row.querySelector(matchStatusSelector).childNodes[0].nodeValue;
			}

			function getMatchStartTime(row) {
				const matchTimeSelector = ".event__time";

				if (!rowContains(row, matchTimeSelector)) {
					return "unavailable";
				}

				return row.querySelector(matchTimeSelector).childNodes[0].nodeValue;
			}

			function matchDetails(row) {
				const FROselector = ".event__stage--pkv";

				return rowContains(row, FROselector)
					? {
						FRO: true
					  }
					: {
						FRO: false
					  };
			}

			function matchResults(row) {
				const resultsSelector = ".event__scores span";

				if (
					rowContains(row, resultsSelector) &&
					row.querySelectorAll(resultsSelector).length > 1 &&
					getMatchStatus(row) === "Finished"
				) {
					const results = row.querySelectorAll(resultsSelector);

					return {
						home: toNumber(results[0].childNodes[0].nodeValue),
						away: toNumber(results[1].childNodes[0].nodeValue)
					};
				} else {
					return {
						home: null,
						away: null
					};
				}
			}

			return data;
		});

		// if (results.length) {
		// 	fs.appendFile(
		// 		"./dumps/matches.json",
		// 		JSON.stringify(results, null, 2),
		// 		err => {
		// 			err
		// 				? console.error("Data not Written!", err) // eslint-disable-line no-console
		// 				: console.log("Data written!"); // eslint-disable-line no-console
		// 		}
		// 	);
		// }

		return results;
	} catch (error) {
		console.log("error", error); // eslint-disable-line no-console
	}
}

module.exports = {
	scrapOdds
};
