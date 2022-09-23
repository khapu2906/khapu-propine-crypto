const Model = require('.')
const transactionTypeCast = require('./../cast/transactionTypeCast')
const timestampCast = require('./../cast/timestampCast')
const tokenCast = require('./../cast/tokenCast')

class Portfolio extends Model
{
	tableName = 'portfolios';

	fillable = [
		'id',
		'token',
		'amount',
		'transaction_type', 
		'timestamp'
	]

	// use cast as a mechanism to convert data when getting and setting
	cast = {
		'token': tokenCast,
		'timestamp': timestampCast,
		'transaction_type': transactionTypeCast
	}

	constructor()
	{
		super()
	}
}

module.exports = Portfolio;