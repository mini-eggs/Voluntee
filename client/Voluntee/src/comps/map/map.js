import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import MapView from 'react-native-maps'
import NoScrollBase from '../base/noScroll'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue,screenWidth} from '../../general/general'
import {incrementDistanceTravelledByUserEmail} from '../../general/firebase'

class MapComp extends React.Component {

  style = {
    MapView: {
      flex: 1,
      width: screenWidth
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      markers: props.markers,
      initial: props.initial,
      tracking: {
        latitude: props.initial.lat,
        longitude: props.initial.long
      }
    }
  }

  componentDidMount() {
  }

  getRegionFromState() {
    return {
      latitude: this.state.initial.lat,              
      longitude: this.state.initial.long,              
      latitudeDelta: 1,
      longitudeDelta: 1
    }
  }

  getMarkers() {
    return this.state.markers.map( (marker, index) => {
      return (
        <MapView.Marker 
          key={ index } 
          coordinate={ marker.coordinate } 
          title={ marker.title } 
          description={ marker.description }
        />
      )
    })
  }

  getDistance(lat1, lon1, lat2, lon2) {
    const radlat1 = Math.PI * lat1/180
    const radlat2 = Math.PI * lat2/180
    const theta = lon1-lon2
    const radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    return dist * 60 * 1.1515
  }

  regionChange(region) {
    if(Actions.user) {
      let distance = this.getDistance( region.latitude, region.longitude, this.state.tracking.latitude, this.state.tracking.longitude )
      distance = parseInt( distance )
      if(distance > 0) {
        incrementDistanceTravelledByUserEmail({ userEmail: Actions.user.email, distance: distance })
        this.setState({
          tracking: {
            latitude: region.latitude,
            longitude: region.longitude
          }
        })
      }
    }
  }

  render() {
    return (
      <NoScrollBase>
         <MapView
          style={ this.style.MapView }
          initialRegion={ this.getRegionFromState() }
          onRegionChangeComplete={ region => { this.regionChange(region) } }
        >
          { this.getMarkers() }
        </MapView>
      </NoScrollBase>
    )
  }

}

export default MapComp

