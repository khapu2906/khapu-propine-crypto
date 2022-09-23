
class FetchApi {

	prototype = 'http'
	ssl = false
	host = 'localhost:80'
	api = {}

	/**
	 * 
	 * @param {*} config 
	 * @returns 
	 */
	setConfig(config) {
		try {
			this.prototype = config.prototype ?? 'http'
			this.ssl = config.ssl || false
			this.host = config.host || 'localhost:80'
			this.api = config.api || {}

			return this
		} catch (e) {
			throw new Error(e.message);
		}
	}

	#handleDomain() {
		let prefix
		if (this.ssl == false) {
			prefix = `${this.prototype}://${this.host}`
		} else {
			prefix = `${this.prototype}s://${this.host}`
		}

		return prefix
	}

	/**
	 * 
	 * @param {string} api 
	 * @param {array} query 
	 * @returns 
	 */
	get(api, query = []) {
		try {
			const domain = this.#handleDomain()
			let path = domain + this.api[api].endpoint

			for(const i in this.api[api].queryParams) {
				if (i == 0) {
					path += `?${this.api[api].queryParams[i]}=${query[i]}`
					continue
				}
				path += `&${this.api[api].queryParams[i]}=${query[i]}`
			}
			return fetch(path)
		} catch (e) {
			throw new Error(e.message)
		}
	}

	/**
	 * 
	 * @param {string} api 
	 * @param {array} query 
	 * @param {*} body 
	 */
	post(api, query = [], body = {}) {
		/** 
		 * Update at new version
		 */
	}

}

module.exports = FetchApi