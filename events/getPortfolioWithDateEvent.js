const portfolioModel = require('./../models/Portfolio')
const cryptoCompareConfig = require('./../configs/service').cryptoCompare
const FetchApi = require('./../libs/FetchAPI')

module.exports = async (date) => {

	// get data form csv
	const model = new portfolioModel()
	const portfolios = await model.whereTime(['timestamp', '=', date, 'y'], 
											['timestamp', '=', date, 'm'],
											['timestamp', '=', date, 'd'])
									// .whereOr(['token', '=', 'SOL'])
									// .where(['token', '=', 'ADA'])
									.get()
	let results = []
	if (portfolios.collection.length) {
		// get all unique value tokens
		let tokens = await portfolios.__token()

		tokens = await tokens.filter((value, index, self) => {
			return self.indexOf(value) === index;
		})

		// get data at compareCrypto
		const cryptoComparesAPI = await (new FetchApi()).setConfig(cryptoCompareConfig)
		const cryptoCompares = await (await cryptoComparesAPI.get('symbolPrice', [tokens.toString(), 'USD'])).json()

		// re-calculate the amount when the different currency
		results = await portfolios.collection.map(result => {
			if (cryptoCompares[result.token]) {
				result.amount *= cryptoCompares[result.token].USD
			}

			return result
		})
	}

	return [
		model.fillable,
		results
	]
}