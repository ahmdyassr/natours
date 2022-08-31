
class APIFeatures {
	constructor(query, queryString) {
		this.query = query
		this.queryString = queryString
	}

	filter() {
		// Build Query
		const queryObject = {...this.query}
		const excludedFields = ['page', 'sort', 'limit', 'fields']
		excludedFields.forEach(el => delete queryObject[el])

		// Filtering
		let queryStr = JSON.stringify(queryObject)
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt )\b/g, match => `$${match}`)

		this.query = this.query.find( JSON.parse(queryStr) )

		return this
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ')
			this.query = this.query.sort(sortBy)
		} else {
			this.query = this.query.sort('-createdAt')
		}

		return this
	}

	limitFields() {
		if (this.query.fields) {
			const fields = this.queryString.fields.split(',').join(' ')
			this.query = this.query.select(fields) // projecting
		} else {
			this.query = this.query.select('-__v')
		}

		return this
	}

	paginate() {
		const page = parseInt(this.queryString.page) || 1
		const limit = parseInt(this.queryString.limit) || 100
		const skip = (page - 1) * limit
  
		this.query = this.query.skip(skip).limit(limit)

		return this
	}
}

module.exports = APIFeatures