import React from 'react'
import {Text,View,TouchableOpacity,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Base from '../base/base'
// import {Button} from 'react-native-material-ui'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {Container,ColSix,Spacer,ColTwelve} from '../bootstrap/bootstrap'
import {style} from './style'
import {loginUser} from '../../general/userActions'
import {darkGreen,screenArea,lightGreen} from '../../general/general'

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

class LoginComp extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			email:null,
			password:null,
			changeStatus: txt => { props.changeStatus(txt) },
			parent: props.parent,
			loading:false
		}
	}
	login(){
		// this.state.parent.showLoading()
		this.setState({loading:true}, () => {
			new Promise((resolve,reject) => {
				if(this.state.email && this.state.password){
					if(this.state.email.length > 0 && this.state.password.length > 0){
						resolve({email:this.state.email,password:this.state.password})
					}
				}
				reject()
			})
			.then( userData => {
				loginUser(userData)
					.then( user => {
						// this.state.parent.hideLoading()
						this.setState({loading:false}, this.state.changeStatus('account'))
					})
					.catch( err => {
						this.error(err.message)
					})
			})
			.catch( err => {
				this.error('Required parameters are not valid')
			})
		})
	}
	clear(){
		this.setState({email:null, password:null})
	}
	error(msg){
		// this.state.parent.hideLoading()
		this.setState({loading:false}, () => {
			Actions.changeModal({
				header:'Error',
				message:msg
			})
			Actions.showModal()
		})
	}
  	render() {
  		return (
  			<View>
  				<View style={inline.Background}>
  					<View style={{margin:10}}>
  						<TextInput
						 	  style={inline.TextInput}
                underlineColorAndroid='transparent'
						   	onChangeText={ txt => this.setState({email:txt})}
						  	value={this.state.email}
						   	placeholder="email"
						   	ref="email"
						   	autoCapitalize="none"
						   	autoCorrect={false}
						   	autoFocus={true}
						   	keyboardType="email-address"
						   	maxLength={50}
						   	onSubmitEditing={ () => { this.refs.password.focus() }}
						   	returnKeyType="next"
					   	/>
					   	<View style={{height:10}} />
    					<TextInput
					      style={inline.TextInput}
                underlineColorAndroid='transparent'
					      onChangeText={ txt => this.setState({password:txt})}
					      value={this.state.password}
					      placeholder="password"
					      ref="password"
						   	autoCapitalize="none"
						   	autoCorrect={false}
						   	keyboardType="default"
						   	maxLength={50}
						   	onSubmitEditing={ () => { this.login() }}
						   	returnKeyType="go"
						   	secureTextEntry={true}
				      	/>
  					</View>

  					<View style={{marginRight:10, marginLeft:10}}>
  						{
  							this.state.loading ?
  								<Loader radius={true} />
  								:
  								<Button radius={true} text="login" onPress={ e => { this.login() }} />
  						}
              <View style={{height:10}} />
              <Button radius={true} text="forgot password" onPress={ e => { Actions.ForgotPassword() } }  />
              <View style={{height:10}} />
              <Button radius={true} text="register" onPress={ e => { this.state.changeStatus('register') }} />
  					</View>
  				</View>
  			</View>
  		)
  	}
}

export default LoginComp