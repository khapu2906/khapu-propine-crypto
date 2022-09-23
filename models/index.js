const path = require('path')
const CSV = require('../libs/csv')
const BASE_PATH = './../configs'
const config = require('./../configs')

class Model {
	pathDBfolder = BASE_PATH + config.db.pathDB;

	/**
	 * a table corresponds to a file
	 * 
	 * @var {String} tableName
	 */
	tableName = ''

	/**
	 * @var {String} typeDB
	 */
	typeDB = 'csv'

	/**
	 * @var {Array} 
	 */
	fillable = []

	/**
	 * Use to save column which want to get
	 * 
	 * @var {Array} selected
	 */
	selected = [

	]

	/**
	 * Save the condition
	 * 
	 * @var {Array} collection
	 */
	collection = []

	/**
	 * Save the condition
	 * 
	 * @var {Object} #conditions
	 */
	#conditions = {
		and: [],
		or: []
	}

	// use cast as a mechanism to convert data when getting and setting
	cast = {}

	constructor() {

	}

	/**
	 * @param {*} conditions
	 */
	where(...conditions) {
		for(const condition of conditions) {
			const con = {
				'attributer': condition[0],
				'operation': condition[1],
				'value': condition[2],
				'type': null
			}
			this.#conditions.and.push(con)
		}
		return this
	}

	/**
	 * @param {*} conditions
	 */
	whereTime(...conditions) {
		for(const condition of conditions) {

			const con = {
				'attributer': condition[0],
				'operation': condition[1],
				'value': new Date(condition[2]),
				'type': 'time'
			}

			switch(condition[3]) {
				case 'd':
					con.value = con.value.getDate()
					con.type = 'date'
					break
				case 'm':
					con.value = con.value.getMonth()
					con.type = 'month'
					break
				case 'y':
					con.value = con.value.getFullYear()
					con.type = 'year'
					break
				default:
					con.value = con.value.getMilliseconds()
			}
			this.#conditions.and.push(con)
		}
		return this
	}

	/**
	 * @param {*} conditions
	 */
	whereOr(...conditions) {
		for(const condition of conditions) {
			const con = {
				'attributer': condition[0],
				'operation': condition[1],
				'value': condition[2],
				'type': null
			}
			this.#conditions.or.push(con)
		}
		return this
	}

	/**
	 * @param {*} columns
	 */
	async get(...columns) {
		this.#builder()
		const pathFileTable = path.join(__dirname, this.pathDBfolder, `${this.tableName}.${this.typeDB}`)
		const csv = new CSV(pathFileTable);
		
		const dataArray = this.#formatData(csv.where(this.#conditions).get(), columns)

		this.collection = await dataArray

		return this
	}

	/**
	 * 
	 * @param {String} withAttribute 
	 * @returns 
	 */
	async max(withAttribute) {
		await this.get()
		if (this.collection.length === 0) {
			return []
		}
		return await this.collection.reduce((a, b) => a[withAttribute] > b[withAttribute] ? a : b);
	}

	async getRaw() {
		this.#builder()
		const pathFileTable = path.join(__dirname, this.pathDBfolder, `${this.tableName}.${this.typeDB}`)
		const csv = new CSV(pathFileTable);
		const dataArray = csv.where(this.#conditions).getContent()

		return await dataArray
	}

	/**
	 * map data corresponds to header
	 * 
	 * @param {array} data 
	 * @param {array} columns
	 * @returns 
	 */
	#formatData(data, columns) {
		const content = data['content'];
		const header = data['header']
		const results = []
		content.forEach(row => {
			let ele = []
			for (const i in header) {
				if (columns.length === 0) {
					if (this.fillable.includes(header[i])) {
						if (this.cast[header[i]]) {
							ele[header[i]] = this.cast[header[i]].get(row[i])
							continue
						}
						ele[header[i]] = row[i]
					}
					
				} else {
					if (this.fillable.includes(header[i]) && columns.includes(header[i])) {
						if (this.cast[header[i]]) {
							ele[header[i]] = this.cast[header[i]].get(row[i])
							continue
						}
						ele[header[i]] = row[i]
					}
				}
			}

			results.push(ele)
		})

		return results
	}
	/**
	 * build function assentor, with each attributer corresponds to a function which has syntax "__<attributer name>()"
	 */
	#builder() {
		for(const attributer of this.fillable) {
			this[`__${attributer}`] = function () {
				const result = this.collection.map((value) => {
					return value[attributer]
				})
				return result
			}
		}
	}

}

module.exports = Model;