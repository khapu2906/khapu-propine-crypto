const portfolioModel = require('./../models/Portfolio')
const cryptoCompareConfig = require('./../configs/service').cryptoCompare
const FetchApi = require('./../libs/FetchAPI')

module.exports = async (token, date) => {

	// get data
	const model = new portfolioModel()
	let portfolios = await model.where(['token', '=', token])
						.whereTime(['timestamp', '=', date, 'y'], 
									['timestamp', '=', date, 'm'],
									['timestamp', '=', date, 'd'])
						.get()

	if (portfolios.collection.length) {
		// get data at compareCrypto
		const cryptoComparesAPI = await (new FetchApi()).setConfig(cryptoCompareConfig)
		const cryptoCompares = await (await cryptoComparesAPI.get('symbolPrice', [token, 'USD'])).json()
		
		// re-calculate the amount when the different currency
		portfolios.collection = await portfolios.collection.map(each => {
			each.amount *= cryptoCompares[token].USD
			return each
		})
	}

	return [
		model.fillable,
		portfolios.collection
	]
}