async function closeBrowser(browser) {
	return browser.close();
}

async function sleep(ms = 3000) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	sleep,
	closeBrowser
};
