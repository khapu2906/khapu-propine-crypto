
module.exports = {
	basePath: './../cli',
	actions: {
		// action 
		'get': {
			handle: 'getPortfolio',
			// arguments of action 
			args: {
				token: 'nullable',
				date: 'nullable'
			}
		}
	}
}