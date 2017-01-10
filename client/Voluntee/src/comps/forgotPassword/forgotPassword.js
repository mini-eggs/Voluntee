import React from 'react'
import { Text, View, TextInput, Platform, Keyboard } from 'react-native'
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase'

import { Button } from '../button/button'
import { Loader } from '../loader/loader'

import Base from '../base/base'
import { logout } from '../../general/firebase'
import { lightGreen, screenArea, defaultBackgroundColor } from '../../general/general'

const style = {
  Container: {
    minHeight: screenArea,
    backgroundColor: defaultBackgroundColor,
    padding: 10
  },
  TextInput:{
    height:40,
    fontSize:18,
    borderColor:lightGreen,
    borderRadius:3,
    margin:0,
    padding:10,
    borderWidth:3
  },
  Spacer: {
    height: 10
  }
}

class ForgotPassword extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      email: '',
      loading: false
    }
  }

  checkSubmit() {
    if(this.state.email !== '') {
      this.setState({ loading: true }, () => { this.submit() } )
    }
  }

  submit() {
    firebase
      .auth()
      .sendPasswordResetEmail( this.state.email )
      .then( success => { this.complete() } )
      .catch( err => { this.fail(err) } )
  }

  complete() {
    Actions.modal({
      header: 'Complete',
      message: `Check the email of ${this.state.email} for instructions on resetting your password`,
      onComplete: () => { this.clear(); Actions.pop() }
    })
  }

  fail(err) {
    if(__DEV__) {
      console.log(err)
    }
    let message = 'Oops, something went wrong'
    if(err.code) {
      if(err.code === 'auth/user-not-found') {
        message = `No user with email of ${this.state.email} exists`
      }
      else if(err.code === 'auth/invalid-email') {
        message = `${this.state.email} is not a valid email`
      }
    }
    Actions.modal({
      header: 'Error',
      message: message,
      onComplete: () => { this.clear() }
    })
  }

  clear() {
    this.setState({ email: '', loading: false })
  }

  hideKeyboard() {
    Keyboard.removeAllListeners('keyboardDidHide')
    Keyboard.addListener('keyboardDidHide', () => { this.checkSubmit() })
    Keyboard.dismiss() 
  }

  render() {
    return (
      <Base>
        <View style={style.Container}>
          <TextInput 
            style={style.TextInput} 
            underlineColorAndroid='transparent' 
            onChangeText={ email => { this.setState({ email: email }) } } 
            value={this.state.email} 
            placeholder="email" 
            autoCapitalize="none" 
            autoCorrect={false} 
            autoFocus={true} 
            keyboardType="email-address" 
            maxLength={50} 
            onSubmitEditing={ () => { this.hideKeyboard() } } 
            returnKeyType="go" 
          />
          <View style={style.Spacer} />
          {
            this.state.loading ? <Loader /> : <Button radius={true} text="reset password" onPress={ () => { this.checkSubmit() } } />
          }
        </View>
      </Base>
    )
  }
}

export default ForgotPassword
