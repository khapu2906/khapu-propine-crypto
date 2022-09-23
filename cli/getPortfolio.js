const getLatestPortfolioEvent = require("./../events/getLatestPortfolioEvent");
const getLatestPortfolioWithTokenEvent = require("./../events/getLatestPortfolioWithTokenEvent");
const getPortfolioWithDateAndTokenEvent = require("./../events/getPortfolioWithDateAndTokenEvent");
const getPortfolioWithDateEvent = require("./../events/getPortfolioWithDateEvent");
const portfolioView = require("./../views/portfolio")

module.exports = (arr) => {
	try {
		if (arr.length > 2) {
			console.error("Input invalid!!")
			return
		}
		
		if (arr['token'] && arr['date']) {
			new Promise((resolve) => {
				resolve(getPortfolioWithDateAndTokenEvent(arr['token'], arr['date']))
			}).then(result => {
				portfolioView(result)
			}).catch(err => {
				throw new Error(err.message);
			})

		} else if (arr['token']) {
			new Promise((resolve) => {
				resolve(getLatestPortfolioWithTokenEvent(arr['token']))
			}).then(result => {
				portfolioView(result)
			}).catch(err => {
				throw new Error(err.message);
			})

		} else if (arr['date']) {
			new Promise((resolve) => {
				resolve(getPortfolioWithDateEvent(arr['date']))
			}).then(result => {
				portfolioView(result)
			}).catch(err => {
				throw new Error(err.message);
			})
		} else {
			new Promise((resolve) => {
				resolve(getLatestPortfolioEvent())
			}).then(result => {
				portfolioView(result)
			}).catch(err => {
				throw new Error(err.message);
			})
		}

	} catch (e) {
		throw new Error(e.message);
	}
};
