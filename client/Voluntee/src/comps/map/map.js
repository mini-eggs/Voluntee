import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import MapView from 'react-native-maps'

import NoScrollBase from '../base/noScroll'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue,screenWidth} from '../../general/general'

const MapComp = props => {

	if(__DEV__) {
		console.log(props.markers)
		console.log(props.initial)
	}

	return (
  		<NoScrollBase>
	 		<MapView
	  			style={{flex:1, width:screenWidth}}
				initialRegion={{
			      	latitude: props.initial.lat,
				    longitude: props.initial.long,
				    latitudeDelta: 1,
				    longitudeDelta: 1
				}}
			>
				{
					props.markers.map( (marker, index) => <MapView.Marker key={index} coordinate={marker.coordinate} title={marker.title} description={marker.description} />)
				}
			</MapView>
  		</NoScrollBase>
	)
}

export default MapComp