const fs = require('fs')
const express = require('express')
const app = express()

const toursData = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

app.get('/api/v1/tours', (req, res) => {
	res.status(200).json({
		status: 'success',
		results: toursData.length,
		data: {
			tours: toursData
		}
	})
})

const port = 3000
app.listen(port, () => {
	console.log(`Server is listening on PORT: ${port}`)
})