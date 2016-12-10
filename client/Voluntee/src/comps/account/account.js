import React from 'react'
import {Text,View,TouchableOpacity,TextInput,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import * as firebase from 'firebase'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import Base from '../base/base'
import LoginComp from './login'
import RegisterComp from './register'
import UserComp from './user'
import {Container,ColSix,Spacer,ColTwelve} from '../bootstrap/bootstrap'
import {style} from './style'
import {removeLoginStateFromLocalStorage} from '../../general/localStorage'
import {logout} from '../../general/firebase'

const signOutUser = props => {
	removeLoginStateFromLocalStorage()
	logout()
	Actions.user = null
}

class Account extends React.Component {
	constructor(props){
		super(props)

		let status = 'login'
		if(Actions.user) status = 'account'

		Actions.changeUser = event => this.changeUser(event)

		this.state = {
			status: status,
			loading: false
		}
	}
	changeStatus(status){
		this.setState({status:status})
	}
	logout(){
		signOutUser()
		this.changeStatus('login')
	}
	changeUser(event){
		this.changeStatus('account')
	}
	showLoading(){
		this.setState({loading:true})
	}
	hideLoading(){
		this.setState({loading:false})
	}
  	render() {
    	return (
    		<Base>
    			{
    				!this.state.loading && this.state.status === 'account' ?
    					<UserComp parent={this} />
    					:
    					<View/>
    			}
    			{
    				!this.state.loading && this.state.status === 'login' ? 
	    				<LoginComp parent={this} changeStatus={txt => {this.changeStatus(txt)}} />
	    				:
	    				<View/>
    			}
    			{
    				!this.state.loading && this.state.status === 'register' ? 
	    				<RegisterComp parent={this} changeStatus={txt => {this.changeStatus(txt)}} />
	    				:
	    				<View/>
    			}
	  			{
	  				this.state.loading ? <Loader /> : <View/>
	  			}
    		</Base>
    	)
  	}
}

export default Account