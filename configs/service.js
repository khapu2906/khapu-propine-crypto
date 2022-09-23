
module.exports = {
	cryptoCompare: {
		prototype: 'http',
		ssl: true,
		host: 'min-api.cryptocompare.com',
		api: {
			symbolPrice: {
				endpoint: '/data/pricemulti',
				method: 'GET',
				queryParams: ['fsyms', 'tsyms']
			}
		}
	}
}