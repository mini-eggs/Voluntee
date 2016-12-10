import Base from '../base/'
import {volunteerMatchAccountName, volunteerMatchAccountKey} from '../../keys/keys'

const request = require('request')
const wsse = require('wsse')
const querystring = require('querystring')
const http = require('http')
const fs = require('fs')

class Events extends Base{
    get(){
    	return new Promise((resolve,reject) => {
    		resolve({status:1, msg:'you are in the events class', params:this.params})
    	})
    }
    findEvents(){
    	return new Promise((resolve,reject) => {

    		let token = wsse({
    			username: volunteerMatchAccountName,
    			password: volunteerMatchAccountKey
    		})

    		let xwsse = token.getWSSEHeader()

    		let options = {
			    url: 'http://www.volunteermatch.org/api/call?action=helloWorld',	
			    method: "GET",
			    headers: {
			        'Accept-Charset': 'UTF-8',
					'Content-Type': 'application/json',
					'Authorization': 'WSSE profile="UsernameToken"',
					'X-WSSE': token.getWSSEHeader()
			    }
			}

			function onComplete (error, response, body){
				if(response){
				    console.log(response.statusCode)
				}
				if(error){
				    console.log(error)
				}
				resolve({what:'ever'})
			}

		  	request(options, onComplete)
    	})
    }
}

export default Events