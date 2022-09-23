const portfolioModel = require('./../models/Portfolio')
const cryptoCompareConfig = require('./../configs/service').cryptoCompare
const FetchApi = require('./../libs/FetchAPI')

module.exports = async () => {
	const model = new portfolioModel()
	const max = await model.max('timestamp')

	if (max.id) {
		// get data at compareCrypto
		const cryptoComparesAPI = await (new FetchApi()).setConfig(cryptoCompareConfig)
		const cryptoCompares = await (await cryptoComparesAPI.get('symbolPrice', [max.token, 'USD'])).json()
		// re-calculate the amount when the different currency
		if (cryptoCompares[max.token]) {
			max.amount = await max.amount * cryptoCompares[max.token].USD
		}
	}

	return await [
		model.fillable,
		[max]
	]
}