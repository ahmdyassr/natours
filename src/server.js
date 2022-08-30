const path = require('path')
const dotenv = require('dotenv')
dotenv.config({
	path: path.resolve(`${__dirname}/config.env`)
})

const app = require('./app')


app.listen(process.env.PORT, () => {
	console.log(`Server is listening on PORT: ${process.env.PORT}`)
})