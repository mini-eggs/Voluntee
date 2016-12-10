import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import router from './logic/router/'
import volunteerScrape from './logic/volunteer/'

const config = {port: process.env.PORT || 8080}

let app = express()
app.server = http.createServer(app)
app.use(bodyParser.json())

app.post('*', (req, res) => {
	router(req.body)
		.then( data => res.end(JSON.stringify(data)))
		.catch( err => res.end(JSON.stringify(err)))
})

app.get('/volunteer', (req, res) => {
	volunteerScrape({res:res}).then( data => {
		res.end(data)
	})
})

app.get('*', (req, res) => res.end('Silence is bliss'))


app.server.listen(config.port)

console.log(`Started on port ${app.server.address().port}`)

export default app
