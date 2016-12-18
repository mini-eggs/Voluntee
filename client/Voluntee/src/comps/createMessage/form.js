import React from 'react'
import {Text,View,TextInput,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import * as firebase from 'firebase'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import {createSharePost} from '../../general/firebase'
import {createMessageAction} from '../../general/userActions'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'

const inline = {
  Background: {
    backgroundColor: '#fff',
    minHeight: screenArea
  },
  TextInput: {
    height: 40,
    fontSize: 18,
    borderColor: lightGreen,
    borderRadius: 3,
    margin: 0,
    padding: 10,
    borderWidth: 3
  },
  TextInputMultiline: {
    height: 150,
    fontSize: 18,
    borderColor: lightGreen,
    borderRadius: 3,
    margin: 0,
    padding: 10,
    borderWidth: 3
  },
  Inner: {
    margin: 10
  },
  Divider: {
    height: 10
  }
}

class CreateForm extends React.Component {

  constructor(props) {

    super(props)
    this.setEvents()
    this.state = {
      title: null,
      description: null,
      parent: props.parent,
      loading: false,
      message: null,
      to: props.to,
      commentKey: props.commentKey
    }

  }

  setEvents() {

    Actions.submitMessageRightButton = async props => {
      this.submitMessage()
    }

  }

  async checkErrors() {

    const message = this.state.message
    return new Promise(async(resolve, reject) => {
      if(!message)
        reject()
      else if(!(message.length > 0))
        reject()
      else
        resolve()
    })

  }

  submitMessageWithProps(messageData) {

    if(this.state.commentKey) {
      messageData.commentKey = this.state.commentKey
    }
    createMessageAction(messageData)

  }

  async submitMessage() {

    this.setState({loading: true})

    const status = this.checkErrors()

    status.then(() => {
      const milli = new Date().getTime()
      const messageData = {
        date: milli,
        descDate: 0 - milli,
        toUserEmail: this.state.to.userEmail,
        toUserDisplayName: this.state.to.userDisplayName,
        toUserPhoto: this.state.to.userPhoto,
        fromUserEmail: Actions.user.email,
        fromUserDisplayName: firebase.auth().currentUser.displayName,
        fromUserPhoto: firebase.auth().currentUser.photoURL,
        message: this.state.message,
        onComplete: () => {
          this.setState({
            loading: false
          }, Actions.popRefresh)
        }
      }
      this.submitMessageWithProps(messageData)
    })

    status.catch(() => {
      Actions.modal({
        header: 'Error',
        message: 'Message is incomplete',
        onComplete: () => {
          this.setState({
            loading: false
          })
        }
      })
    })

  }

  async clear() {

    return new Promise(async(resolve, reject) => {
      this.setState({
        title: null,
        description: null
      }, resolve())
    })

  }

  async error(msg) {

    return new Promise(async(resolve, reject) => {
      this.setState({
        loading: false
      }, () => {
        Actions.modal({
          header: 'Error',
          message: msg,
          onComplete: () => {
            resolve()
          }
        })
      })
    })

  }

  render() {
    return(
      <View style={inline.Background}>
	    		<View style={inline.Inner}>
			   		<TextInput
					 	style={inline.TextInputMultiline}
					   	onChangeText={ txt => this.setState({message:txt})}
					  	value={this.state.message}
					   	placeholder="message"
					   	ref="message"
					   	autoCapitalize="sentences"
					   	autoCorrect={true}
					   	autoFocus={Actions.user != null}
					   	multiline={true}
					   	blurOnSubmit={true}
					   	onSubmitEditing={ () => {this.submitMessage()} }
					   	returnKeyType="go"
				   	/>
					<View style={inline.Divider} />
		  			{
		  				this.state.loading ?
		  					<Loader radius={true} />
		  					:
		  					<Button radius={true} text="submit" onPress={ e => { this.submitMessage() }} />
		  			}
	  			</View>
    		</View>
    )
  }
}

export default CreateForm