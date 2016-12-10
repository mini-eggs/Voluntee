
const request = require('request')
const cheerio = require('cheerio')

export default props => new Promise((resolve,reject) => {

	const size = 1
	const aPageSize = 10
	const base = "https://www.volunteermatch.org/search/?o=recency"

	let numOfRequests = 0

	const routine = props => {
		let status = false
		numOfRequests++
		// id searchresults
		// class searchitem PUBLIC -> id - opp
		let $ = cheerio.load(props.body)
		let container = $('#searchresults')
		let pageSize = container.find('.searchitem.PUBLIC').length
		props.res.write(pageSize + '\n')
		if(numOfRequests >= size) resolve('end')
		if(pageSize == aPageSize) status = true
		console.log(status)
		return status
	}

	Array.apply({},Array(size)).forEach( (x,index) => {

		let currentPage = 1
		let shouldContinue = true

		while(shouldContinue){

			let url = base + '&s=' + currentPage + '&l=' + index

			request(url, (err, res, body) => {
				currentPage+=aPageSize
				console.log('here')
				if(err) {
					shouldContinue = false
					return
				}
				shouldContinue = routine({
					res:props.res,
					body:body
				})
			})
		}
	})
})