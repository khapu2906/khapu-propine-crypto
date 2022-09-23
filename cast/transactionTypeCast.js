module.exports = {
	get: (data) => {
		if (data == 0) {
			return 'DEPOSIT'
		} else if( data == 1) {
			return 'WITHDRAWAL'
		}
	},
	set: (data) => {
		if (data == 'DEPOSIT') {
			return 0
		} else if( data == 'WITHDRAWAL') {
			return 1
		}
	}
}