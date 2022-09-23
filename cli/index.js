#!/usr/bin/env node
const args = process.argv.slice(2)

// get config cli
const cliConfig = require('./../configs').cli

// require validate
const validate = require('./../libs/validate');

const availableActions = cliConfig.actions

const requestAction = args[0]

// check cli exist?
if (!availableActions[requestAction]) {
	console.error("Command line not found")
	return
}

// get cli will handle the request
const requestCli = availableActions[requestAction].handle

args.shift()

// validate data
const request = validate(args, availableActions[requestAction].args)

if (request.errors.length > 0) {
	request.errors.forEach(err => {
		console.error(err)
	})
} else {
	require(`./${requestCli}`)(request.arguments)
}
