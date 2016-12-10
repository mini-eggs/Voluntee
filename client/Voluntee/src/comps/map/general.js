// use actions to switch
// to map component
import {Actions} from 'react-native-router-flux'
// display lit of items
// on to map component
// this will be used to discover
// page and saved page
const displayListOnMap = async props => {
	// base geo long
	// and lat
	const geo = {
		lat:0,
		long:0
	}
	// push valid markers into array
	let markers = []
	// we need to manually count these
	// some events will NOT have valid
	// lat and longs
	// we dont count those
	// as we don't display them
	let count = 0
	// iterate through
	// list of events
	// catching invalid geos
	await props.events.forEach( async item => {
		if(item.address.geo) {
			if(item.address.geo.lat && item.address.geo.long) {
				// increment count
				// check if geo points are vlaid
				// push the marker and increment if so
				count++
				geo.lat += parseFloat(item.address.geo.lat)
				geo.long += parseFloat(item.address.geo.long)
				markers.push({
					title: item.name,
					description: item.desc,
					coordinate: {
						latitude: parseFloat(item.address.geo.lat),
						longitude: parseFloat(item.address.geo.long)
					}
				})
			}
		}
	})
	// call map components based
	// on events and initial region
	// initial region being a median 
	// lats and longs
	// there are markers
	// go to map component
	if(markers.length > 0) {
		// divide list based on number
		// of valid geo codes
		geo.lat /= count 
		geo.long /= count 
		// call map component
		Actions.MapComp({
			title: 'Map',
			initial: geo,
			markers: markers
		})
	}
	// no available markers
	// display error message
	// to user
	else {
	    Actions.changeModal({
	   		header: 'Error',
	       	message: 'No events in current list have valid geo locations'
	   	})
	   	Actions.showModal()
   }
}
export {displayListOnMap}