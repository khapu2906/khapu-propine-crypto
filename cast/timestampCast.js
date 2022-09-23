module.exports = {
	get: (data) => {
		return new Date(data * 1000)
	},
	set: (data) => {
		return data
	}
}