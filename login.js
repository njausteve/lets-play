const credentials = require("./credentials");
const { sleep } = require("./utils");

async function login(browser, page) {
	try {
		const loginButtonSelector = "#signIn";
		await page.click(loginButtonSelector);
		await sleep(3000);

		const emailFieldSelector = "#email";
		await page.click(emailFieldSelector);
		await page.keyboard.type(credentials.username);

		const passwordFieldSelector = "#passwd";
		await page.click(passwordFieldSelector);
		await page.keyboard.type(credentials.password);

		const loginSubmitButtonSelector = "#login";
		await page.click(loginSubmitButtonSelector);

		const login_close_button = "#lsid-window-close";
		await page.click(login_close_button);
	} catch (error) {
		console.log("error", error); // eslint-disable-line no-console
	}
}

module.exports = {
	login
};
