module.exports = (args, availableArgs) => {
	let errors = []
	let arguments = []

	const availableArguments = Object.keys(availableArgs)

	// check attribute is matched with config
	args.forEach(each => {
		each = each.split('=', 2)
		if (!availableArguments.includes(each[0])) {
			errors.push(`${each[0]} is invalid`)
		} else {
			arguments[each[0]] = each[1]
		}
	})

	return {
		errors,
		arguments
	}
}