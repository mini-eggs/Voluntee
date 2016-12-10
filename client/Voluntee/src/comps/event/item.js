import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue,screenWidth} from '../../general/general'
import {saveEvent,removeEventFromSavedByKey} from '../../general/firebase'

const style = {
	container:{
		padding:10,
		backgroundColor:'#fff',
		minHeight:screenArea,
	},
	header:{
		color:'#000',
		fontSize:22,
		fontWeight:'600'
	},
	Text:{
		color:'#000',
		fontSize:12,
	},
	divider:{
		backgroundColor:lightGreen,
		height:2,
		width:screenWidth * 0.8,
		marginLeft: screenWidth * 0.05,
		marginTop:10,
		marginBottom:10
	},
}

class SaveEventButton extends React.Component {

	constructor(props) {
		super(props)
		this.state={
			event:props.event,
			loading:false
		}
	}

	// save this event in the firebase 
	// database base with user data
	async saveThisEvent() {
		// show user we're loading 
		this.setState({loading:true})
		// create data object
		const milli = new Date().getTime()
		const saveData = {
			userEmail:Actions.user.email,
			event:this.state.event,
			eventId:this.state.event.id,
			date:milli,
			descDate:0-milli
		}
		// save the event via firebase
		try {
			await saveEvent(saveData)
			this.setState({loading:false})
			//show user we've done this successfully
			Actions.changeModal({
				header: 'Complete',
				message: `${this.state.event.name} has been saved`
			})
			Actions.showModal()
		}
		catch(err) {
			//show user there was an error
			this.setState({loading:false})
			Actions.changeModal({
				header: 'Error',
				message: `${this.state.event.name} has already been saved`
			})
			Actions.showModal()
		}
	}

	// this event has previously been saved
	// and the user now wants to remove it
	// from their saved
	// delete this from firebase
	// base on the key found in the firebaseSavedKey key
	async removeThisEvent() {
		this.setState({loading:true})
		try {
			const removeStatus = await removeEventFromSavedByKey({
				key:this.state.event.firebaseSavedKey
			})
			console.log(removeStatus)
			Actions.changeModal({
                header:'Complete',
                message:`${this.state.event.name} has been remove from your saved list`,
                onComplete: () => {
                	// this takes care of the 
                	// nastiness of reloading state
                	// in the previous component
                	// go directly to the discover component
                	Actions.pop({refresh:{time:new Date().getTime()}})
                }
            })
            Actions.showModal()
		}
		catch(err) {
			this.setState({loading:false})
			if(__DEV__) {
				console.log(`An error has occurred while trying to remove this event from the user, ${Actions.user.email}'s saved events`)
				console.log('Details below:')
				console.log(err)
			}
			Actions.changeModal({
                header:'Error',
                message:'Oops, something went wrong'
            })
            Actions.showModal()
		}
	}

	render() {
		return(
			<View>
				{
					this.state.loading ?
						<Loader radius={true} />
						:
						this.state.event.alreadySaved ?
							<Button
								onPress={ () => this.removeThisEvent()}
								text="Remove from saved events"
								radius={true}
							/>
							:
							<Button
								onPress={ () => this.saveThisEvent()}
								text="Save this event"
								radius={true}
							/>
				}
			</View>
		)
	}
}

const singleEventItem = props => {

	// this contains things the user wants to see
	const fullEvent = props.fullEvent

	// this contains things we want to see. IDs/etc.
	const event = props.event

	let button = (
		<Button 
			onPress={() => { Actions.Account() }}
			text="sign in to save events"
		/>
	)

	if(Actions.user)
		button = <SaveEventButton event={event} />

	return(
		<View style={style.container}>
			<Text style={style.header}>{fullEvent.title}</Text>
			<View style={style.divider} />
			<Text style={style.Text}>{fullEvent.desc}</Text>

			<View style={{height:10}} />

			{button}
		</View>
	)
}

export default singleEventItem