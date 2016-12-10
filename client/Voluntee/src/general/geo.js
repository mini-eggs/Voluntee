import {geonamesAccountName} from '../keys/keys'

const getZipFromLatAndLong = props => new Promise((resolve,reject) => {

  	let url = "http://api.geonames.org/findNearbyPostalCodesJSON"
  	url += '?username=' + geonamesAccountName
  	url += '&lat=' + props.lat
  	url += '&lng=' + props.long

    console.log(url)

    fetch(url)
      .then( json => json.json())
      .then( data => resolve(data))
      .catch( err => reject(err))
})
export {getZipFromLatAndLong}

const getLocation = props => new Promise((resolve,reject) => {
    let data = {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    navigator.geolocation.getCurrentPosition(resolve,reject,data)
})
export {getLocation}