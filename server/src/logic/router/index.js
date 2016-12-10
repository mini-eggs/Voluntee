import Events from '../events/'

export default props => new Promise((resolve, reject) => {

	let data = {status:-1, msg:'error 8912ty3912'}

	switch(props.type){
		case "events":
			data = new Events(props)
			data.get()
				.then( data => resolve(data))
			break;
		case "findEvents":
			data = new Events(props)
			data.findEvents()
				.then( data => {
					resolve({data:data})
				})
		default:
			reject(data)
	}
})

// curl -H "Content-Type: application/json" -X POST -d '{"type":"events"}' http://localhost:8080/
// curl -H "Content-Type: application/json" -X POST -d '{"type":"findEvents"}' http://localhost:8080/