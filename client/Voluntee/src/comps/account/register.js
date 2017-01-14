import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Base from '../base/base'
import {Avatar} from 'react-native-material-ui/src'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {Container,ColSix,Spacer,ColTwelve} from '../bootstrap/bootstrap'
import {style} from './style'
import {registerNewUser} from '../../general/userActions'
import {uploadPhotoToImgur} from '../../general/imgur'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto} from '../../general/general'
import PhotoIcon from '../../assets/img/photo.png'

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
		marginBottom:10,
		borderWidth:3
	}
}

class RegisterComp extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			username:null,
			email:null,
			password:null,
			image:null,
			changeStatus: txt => { props.changeStatus(txt) },
			parent: props.parent,
			loadingRegisteration:false
		}
	}

	register(){
		this.setState({loadingRegisteration:true}, () => {
			new Promise((resolve,reject) => {
				if(!this.state.image) reject("No image has been chosen")
				if(this.state.username && this.state.email && this.state.password){
					if(this.state.username.length > 0 && this.state.email.length > 0 && this.state.password.length > 0){
						resolve({
							username:this.state.username,
							email:this.state.email,
							password:this.state.password,
							image:this.state.image
						})
					}
				}
				reject()
			})
			.then( userData => {
				registerNewUser(userData)
					.then( user => {
						this.setState({loadingRegisteration:false}, e => { this.state.changeStatus('account') })
					})
					.catch( err => {
						this.error(err.message)
					})
			})
			.catch( err => {
				if(!err) {
          err = 'Required parameters are not valid'
        }
				this.error(err)
			})
		})
	}

	clear(){this.setState({username:null, password:null, email:null})}

	error(msg){
		this.setState({loadingRegisteration:false}, () => {
			Actions.modal({
				header:'Error',
				message:msg
			})
		})
	}

	async grabImage(){
		try {
			const photo = await getPhoto()
			this.setState({imageLoading:true})
			const imgurPhoto = await uploadPhotoToImgur({image:photo})
			this.setState({image:imgurPhoto, imageLoading:false})
		}
		catch(err) {
			this.setState({imageLoading:false})
		}
	}

  	render() {
  		return (
  			<View>
  				<View style={inline.Background}>
  					<View style={UserDescCompStyle.Container}>
  						<View style={{flexDirection:'row',justifyContent:'center'}}>
  							<View style={{flex:0.25}}>
						  		{
						  			this.state.image ? 
										<TouchableOpacity onPress={ (e) =>  this.grabImage()}>
											<Image style={UserDescCompStyle.UserImage} source={{uri:this.state.image}} />
										</TouchableOpacity>
										:
										<TouchableOpacity onPress={ (e) =>  this.grabImage()}>
											<View style={UserDescCompStyle.Cirlce}>
												{
													this.state.imageLoading ?
														<ActivityIndicator style={UserDescCompStyle.ActivityIndicator} color="#fff" />
														:
														<Image style={UserDescCompStyle.Image} source={PhotoIcon}/>
												}
										  	</View>
										</TouchableOpacity>
					  			}
				  			</View>
				  			<View style={{flex:0.75}}>
				  				<View style={UserDescCompStyle.Spacer} />
				  				<Text numberOfLines={1} style={UserDescCompStyle.Text}>{this.state.username ? this.state.username : 'username'}</Text>
				  				<Text numberOfLines={1} style={UserDescCompStyle.Text}>{this.state.email ? this.state.email : 'email'}</Text>
				  			</View>
			  			</View>
  					</View>
  					<View style={{marginLeft:10,marginRight:10}}>
  						<TextInput
							  style={inline.TextInput}
                underlineColorAndroid='transparent'
						    onChangeText={ txt => this.setState({username:txt})}
							  value={this.state.username}
				     	  placeholder="username"
					   	  autoCapitalize="none"
					   	  ref="username"
					   	  autoCapitalize="none"
							  autoCorrect={false}
						   	autoFocus={true}
						   	keyboardType="default"
						   	maxLength={50}
						   	onSubmitEditing={ () => { this.refs.email.focus() }}
						   	returnKeyType="next"
					   	/>
		    			<TextInput
						 	  style={inline.TextInput}
                underlineColorAndroid='transparent'
						   	onChangeText={ txt => this.setState({email:txt})}
						  	value={this.state.email}
						   	placeholder="email"
						   	autoCapitalize="none"
					      ref="email"
							  autoCapitalize="none"
						   	autoCorrect={false}
						   	keyboardType="email-address"
						   	maxLength={50}
						   	onSubmitEditing={ () => { this.refs.password.focus() }}
						   	returnKeyType="next"
					   	/>
	    				<TextInput
					      style={inline.TextInput}
                underlineColorAndroid='transparent'
					      onChangeText={ txt => this.setState({password:txt})}
					      value={this.state.password}
					      placeholder="password"
						   	autoCapitalize="none"
						    ref="password"
						   	autoCapitalize="none"
						   	autoCorrect={false}
						   	keyboardType="default"
						   	maxLength={50}
						   	onSubmitEditing={ () => { this.register() }}
						   	returnKeyType="go"
						   	secureTextEntry={true}
					   	/>
  					</View>
  					<View>

  						<View style={{flexDirection:'row'}}>
  							<View style={{flex:0.5, margin:10, marginRight:5, marginTop:0}}>
  								<Button radius={true} text="back" onPress={ e => { this.state.changeStatus('login') }} />
  							</View>
  							<View style={{flex:0.5, margin:10, marginLeft:5, marginTop:0}}>
  								<Button radius={true} text="add photo" onPress={ e => { this.grabImage() }} />
  							</View>
  						</View>

  						<View style={{marginRight:10, marginLeft:10}}>
  							{
  								this.state.loadingRegisteration ? 
  									<Loader radius={true} />
  									:
  									<Button radius={true} text="register" onPress={ e => { this.register() }} />
  							}
  						</View>
					</View>
  				</View>
  			</View>
  		)
  	}
}

export default RegisterComp