import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue,screenWidth, theme} from '../../general/general'
import {saveEvent,removeEventFromSavedByKey} from '../../general/firebase'
import {checkBadgesAction} from '../../general/userActions'

const style = {
	container:{
		padding:10,
		backgroundColor:'#fff',
		minHeight:screenArea,
	},
	header:{
		color:theme.primaryFontColor,
		fontSize:20,
		fontWeight:'600'
	},
	Text:{
		color:theme.secondaryFontColor,
		fontSize:16,
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


	async saveThisEvent() {

		this.setState({loading:true})

		const milli = new Date().getTime()
		const saveData = {
			userEmail:Actions.user.email,
			event:this.state.event,
			eventId:this.state.event.id,
			date:milli,
			descDate:0-milli
		}

		try {
			await saveEvent(saveData)
			this.setState({loading:false})
			Actions.modal({
				header: 'Complete',
				message: `${this.state.event.name} has been saved`,
        onComplete: () => { checkBadgesAction({ userEmail: Actions.user.email }) }
			})
		}

		catch(err) {
			this.setState({loading:false})
			Actions.modal({
				header: 'Error',
				message: `${this.state.event.name} has already been saved`
			})
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
			Actions.modal({
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
		}
		catch(err) {
			this.setState({loading:false})
			if(__DEV__) {
				console.log(`An error has occurred while trying to remove this event from the user, ${Actions.user.email}'s saved events`)
				console.log('Details below:')
				console.log(err)
			}
			Actions.modal({
        header:'Error',
        message:'Oops, something went wrong'
      })
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

	if(Actions.user) {
		button = <SaveEventButton event={event} />
  }

  console.log(fullEvent)

	return(
		<View style={style.container}>


      <Text style={style.header}>{fullEvent.title}</Text> 

      <Text style={style.header}>Description</Text>
      <Text style={style.Text}>{fullEvent.desc}</Text>

      <Text style={style.header}>Skills</Text>
      {
        fullEvent.skills.map( (item, index) => {
          return (
            <Text key={index} style={style.Text}>{item}</Text>
          )
        })
      }

      <Text style={style.header}>Causes</Text>
      {
        fullEvent.causes.map( (item, index) => {
          return (
            <Text key={index} style={style.Text}>{item}</Text>
          )
        })
      }

      <Text style={style.header}>Requirements</Text>
      {
        fullEvent.requirements.map( (item, index) => {
          return (
            <Text key={index} style={style.Text}>{item}</Text>
          )
        })
      }

      <Text style={style.header}>Where</Text>
      <Text style={style.Text}>{fullEvent.address.street}</Text>
      <Text style={style.Text}>{fullEvent.address.city}{fullEvent.address.state}</Text>
      <Text style={style.Text}>{fullEvent.address.zip}</Text>

      <Text style={style.header}>Contact</Text>
      <Text style={style.Text}>{fullEvent.contact.name}</Text>
      <Text style={style.Text}>{fullEvent.contact.number}</Text>

      <Text style={style.header}>{fullEvent.orgName}</Text>
      {
        fullEvent.missionStatement.map( (item, index) => {
          return (
            <Text key={index} style={style.Text}>{item}</Text>
          )
        })
      }

			<View style={{height:10}} />

			{button}
		</View>
	)
}

export default singleEventItem