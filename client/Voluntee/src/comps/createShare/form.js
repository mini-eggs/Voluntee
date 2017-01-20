import React from 'react'
import {Text,View,TextInput,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import * as firebase from 'firebase'


import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {Container,ColSix,Spacer,ColTwelve} from '../bootstrap/bootstrap'
import {createSharePost} from '../../general/firebase'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'
import { checkBadgesAction } from '../../general/userActions'
import {style} from './style'

const inline = {
	Background:{
		backgroundColor:'#fff',
		minHeight:screenArea
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
	TextInputMultiline:{
		height:150,
		fontSize:18,
		borderColor:lightGreen,
		borderRadius:3,
		margin:0,
		padding:10,
		borderWidth:3,
    textAlignVertical: 'top'
	},
	Inner:{
		margin:10
	},
	Divider:{
		height:10
	}
}

class CreateForm extends React.Component {

	constructor(props){
		super(props)
		Actions.submitSharePostRightButton = props => { this.submitShare() }
		this.state = {
			title:null,
			description:null,
			parent:props.parent,
			loading:false,
      autoFocus: true
		}
	}

	submitShare(){
		this.setState({loading:true, autoFocus: false}, () => {
			new Promise((resolve,reject) => {
				if(this.state.title && this.state.description){
					if(this.state.title.length > 0 && this.state.description.length > 0){
						let milli = new Date().getTime()
						resolve({
							title:this.state.title,
							description:this.state.description,
							userEmail:Actions.user.email,
							userDisplayName:firebase.auth().currentUser.displayName,
							userPhoto:firebase.auth().currentUser.photoURL,
							date:milli,
							descDate:0-milli
						})
					}
				}
				reject()
			})
			.then( shareData => {
				createSharePost(shareData)
					.then( share => {
						this.setState({loading:false}, () => {
							this.clear()
							Actions.modal({
								header:'Complete',
								message:shareData.title + ' has been created',
								onComplete: event => {
                  checkBadgesAction({ userEmail: Actions.user.email })
									Actions.reloadShareComponent()
									Actions.pop()
								}
							})
						})
					})
			})
			.catch( err => {
				this.error('Required fields are missing')
			})
		})
	}
	clear(){
		this.setState({title:null, description:null})
	}
	error(msg){
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
	    			<View style={inline.Inner}>
	    				<TextInput
							  style={inline.TextInput}
                underlineColorAndroid='transparent'
						   	onChangeText={ txt => this.setState({title:txt})}
						  	value={this.state.title}
						   	placeholder="title"
						   	ref="title"
						   	autoCapitalize="words"
						   	autoCorrect={true}
						   	autoFocus={Actions.user != null && this.state.autoFocus}
						   	maxLength={50}
						   	onSubmitEditing={ () => { this.refs.description.focus() }}
						   	returnKeyType="next"
					   	/>
					   	<View style={inline.Divider} />
			    		<TextInput
						 	  style={inline.TextInputMultiline}
                underlineColorAndroid='transparent'
						   	onChangeText={ txt => this.setState({description:txt})}
						  	value={this.state.description}
						   	placeholder="description"
						   	ref="description"
						   	autoCapitalize="sentences"
						   	autoCorrect={true}
						   	autoFocus={false}
						   	multiline={true}
						   	blurOnSubmit={true}
						   	onSubmitEditing={ () => { this.submitShare() }}
						   	returnKeyType="go"
					   	/>
					   	<View style={inline.Divider} />
		  				{
		  					this.state.loading ?
		  						<Loader radius={true} />
		  						:
		  						<Button radius={true} text="submit" onPress={ e => { this.submitShare() }} />
		  				}
	  				</View>
    			</View>
	  		</View>
    	)
  	}
}

export default CreateForm