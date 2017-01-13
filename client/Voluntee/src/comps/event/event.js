import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Avatar} from 'react-native-material-ui'
import * as firebase from 'firebase'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import Base from '../base/base'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'
import {addItemToProfile,getShareWallPostsCountByUserEmail,getDatabaseCategoryCountByRefAndTypeAndUserEmail, removeEventFromSavedByKey} from '../../general/firebase'
import {getEventFromId} from '../../general/volunteerMatch'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {style} from '../share/style'
import SingleEventItem from './item'

const circle = 50
const ratio = 0.6
const borderSize = 2
const UserDescCompStyle = {
	Spacer:{
		height:4
	},
	Container:{
		backgroundColor:lightGreen,
		margin:10,
		padding:10,
		borderRadius:3
	},
	Image:{
		height:circle * ratio - borderSize * 2,
		width:circle * ratio - borderSize * 2,
		marginLeft: ( (circle/2) * (1 - ratio) )
	},
	Cirlce:{
		backgroundColor:lightGreen,
		width:circle,
		height:circle,
		borderRadius:circle/2,
		flex:1,
		alignItem:'center',
		justifyContent:'center',
		borderWidth:borderSize,
		borderColor:'#fff'
	},
	UserImage:{
		resizeMode:'cover',
		width:circle,
		height:circle,
		borderRadius:circle/2,
		borderWidth:borderSize,
		borderColor:'#fff'
	},
	ActivityIndicator:{
	},
	Text:{
		fontSize:16,
		color:'#fff',
		fontWeight:'600'
	}
}

const inline = {
	Background:{
		backgroundColor:'#fff',
		minHeight:screenArea
	},
	userImage:{
		flexDirection:'row',
		alignItem:'center',
		justifyContent:'center',
		marginTop:15, 
		marginBottom:15
	},
	Border:{
		borderColor:"#fff"
	},
	TextInput:{
		height:40,
		fontSize:18,
		borderColor:lightGreen,
		borderRadius:3,
		margin:0,
		padding:10,
		borderWidth:3
	}
}

const showMapError = props => {
	Actions.modal({
		header: 'Woah!',
		message: 'This volunteer opportunity has not registered a geo location.'
	})
}

const displayMap = props => {
	// get geo
	let geo = props.event.address.geo
	try {
		// check geo
		if(geo.lat && geo.long){
			// make geo a float
			// not doing this breaks on android
			// and ints sucks
			geo.lat = parseFloat(geo.lat)
			geo.long = parseFloat(geo.long)
			// call map component
			// with props
			Actions.MapComp({
				title:props.event.name,
				initial:{lat:geo.lat,long:geo.long},
				markers:[{
					title:props.event.name,
					description:props.event.desc,
					coordinate:{latitude:geo.lat,longitude: geo.long}
				}]
			})
		}
		// show error to user
		else showMapError()
	}
	catch(err) {
		if(__DEV__) {
			console.log('Geo was not defined in displayMap function in events.js error below')
			console.log(err)
		}
		showMapError()
	}
}

class EventComponent extends React.Component {

	constructor(props){
		super(props)
		Actions.ViewSingleEventOnMap = () => {
			// this is based off the the current state's
			// data so there's no need to reload this
			// in the componentWillReceiveProps lifecycle method
			this.componentWillDisplayMap()
		}
		this.state = {
			event:props.post,
			fullEvent:null,
			loading:true
		}
	}

	// this will be hit after
	// user returns from map
	// view. when calling modal
	// this post this we're still
	// hitting boggies
	componentWillReceiveProps(props){
		const initialState = {
			event:props.post,
			fullEvent:null,
			loading:true
		}
		this.setState(initialState, this.getFullEvent)
	}

	async getFullEvent() {
		try{
			const fullEvent = await getEventFromId(this.state.event)
			this.setState({fullEvent:fullEvent,loading:false})
		}
		catch(err){
			if(__DEV__) console.log(err)
			// generic somethign went wrong message
			// figure out when this breaks

      if(typeof err.status !== 'undefined') {
        if(err.status === 0) {
          Actions.modal({
            header: 'Woah!',
            message: err.msg,
            onComplete: () => { this.eventHasBeenRemoved() }
          })
        }
        else {
          this.generalError()
        }
      }
      else {
        this.generalError()
      }
		}
	}

  async eventHasBeenRemoved() {
    try {
      const status = await removeEventFromSavedByKey({ key: this.state.event.firebaseSavedKey })
      Actions.popRefresh()
    }
    catch(err) {
      Actions.modal({
        header:'Error',
        message:'Oops, something went wrong',
        onComplete: () => { Actions.popRefresh() }
      })
    }
  }

  generalError() {
    Actions.modal({
      header:'Error',
      message:'Oops, something went wrong'
    })
  }

	componentDidMount(){
		this.getFullEvent()
	}

	componentWillDisplayMap(){
		displayMap(this.state)
	}

  	render() {
  		return (
  			<Base>
  				{
  					this.state.loading ?
	  					<Loader/>
	  					:
	  					<SingleEventItem fullEvent={this.state.fullEvent} event={this.state.event} />
  				}
  			</Base>
  		)
  	}
}

export default EventComponent