const fs = require('fs')

class CSV {
	path = ''

	indexHeaderRow = true;

	column = 0;

	headers = []

	contents = []

	offset = 0;

	limit = null;

	#conditions = [

	]

	constructor(path = '') {
		this.path = path;
	}

	/**
	 * 
	 * @param {array} conditions 
	 * @returns 
	 */
	where(conditions) {
		this.#conditions = conditions
		return this
	}

	getHeaderRow() {
		const dataRaw = this.getRaw();

		const dataArray = dataRaw.split('\n')

		if (this.indexHeaderRow && dataArray.length > 0) {
			this.headers = dataArray[0].split(',')
		}

		return this.headers
	}

	getContent() {
		const dataRaw = this.getRaw();

		let dataArray = dataRaw.split('\n')

		let header = []

		if (this.indexHeaderRow) {
			header = dataArray.shift()
			header = header.split(',')
		}

		dataArray = dataArray.map(each => {
			return each.split(',')
		})

		if (this.#conditions.and.length == 0 && this.#conditions.or.length == 0) {
			return dataArray
		}

		dataArray = this.#handleConditions(dataArray, header)

		return dataArray
	}

	get() {
		return {
			header: this.getHeaderRow(),
			content: this.getContent()
		}
	}

	offset(number) {
		this.offset = number
		return this
	}

	limit(number) {
		this.limit = number
		return this
	}

	getRaw() {
		return fs.readFileSync(this.path, { encoding: 'utf8' })
	}

	/**
	 * 
	 * @param {*} data 
	 * @param {*} header 
	 * @returns 
	 */
	#handleConditions(data, header) {
		const d = data.filter(ele => {
			let status = 0
			for(const [caseCondition, condition] of Object.entries(this.#conditions)) {
				switch (caseCondition) {
					case 'and':
						for(const logic of condition) {
							if (header.includes(logic['attributer'])) {
								if (status === 0) {
									status = this.#handleType(logic, ele, false, header)
								} else {
									const s = this.#handleType(logic, ele, false, header)
									status = (status === true && s === true) ? true : false
								}
							}
						}
						break;
					case 'or': 
						condition.forEach(logic => {
							if (header.includes(logic['attributer'])) {
								if (status === 0) {
									status = this.#handleType(logic, ele, false, header)
								} else {
									const s = this.#handleType(logic, ele, false, header)
									status = (!status && !s) ? false : true
								}
		
							}
						})
						break;
				}
			}
			if (status === true) {
				return ele
			}
		})

		return d
	}

	/**
	 * 
	 * @param {*} x 
	 * @param {*} logic 
	 * @param {*} ele 
	 * @param {*} status 
	 * @param {*} header 
	 * @returns 
	 */
	#handleOperation(x, logic, ele, status, header) {
		switch (logic['operation']) {
			case '=':
				status = (x == logic['value']) ? true : false
				break
			case '<':
				status = (x < logic['value']) ? true : false
				break;
			case '<=':
				status = (x <= logic['value']) ? true : false
				break;
			case '>':
				status = (x > logic['value']) ? true : false
				break;
			case '>=':
				status = (x >= logic['value']) ? true : false
				break;
			case '<>':
				status = (x != logic['value']) ? true : false
				break;
		}
		return status
	}

	/**
	 * 
	 * @param {*} logic 
	 * @param {*} ele 
	 * @param {*} status 
	 * @param {*} header 
	 * @returns 
	 */
	#handleType(logic, ele, status, header) {
		let x
		switch (logic['type']) {
			case 'date':
				x = new Date(ele[header.indexOf(logic['attributer'])] * 1000).getDate()
				break
			case 'month':
				x = new Date(ele[header.indexOf(logic['attributer'])] * 1000).getMonth()
				break;
			case 'year':
				x = new Date(ele[header.indexOf(logic['attributer'])] * 1000).getFullYear()
				break;
			case 'time':
				x = new Date(ele[header.indexOf(logic['attributer'])] * 1000).getMilliseconds
				break;
			default:
				x = ele[header.indexOf(logic['attributer'])]
		}
		status = this.#handleOperation(x, logic, ele, status, header)
		return status
	}

}

module.exports = CSV