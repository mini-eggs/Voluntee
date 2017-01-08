import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Avatar,ListItem} from 'react-native-material-ui'
import * as firebase from 'firebase'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {createComment} from '../../general/firebase'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'
import { checkBadgesAction } from '../../general/userActions'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import Base from '../base/base'
import {style} from './style'

const inline = {
	TextInputMultiline:{
		height:100,
		fontSize:18,
		borderColor:lightGreen,
		borderRadius:3,
		margin:0,
		padding:10,
		borderWidth:3,
    textAlignVertical: 'top'
	}
}

class FormComp extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			comment:null,
			loading:false,
			key:props.data.key,
			ref:props.data.ref,
			parent:props.data.parent
		}
	}

	addComment(comment){
		return new Promise((resolve,reject) => {
			let milli = new Date().getTime()
			createComment({
				comment:comment,
				userEmail:Actions.user.email,
				userDisplayName:firebase.auth().currentUser.displayName,
				userPhoto:firebase.auth().currentUser.photoURL,
				date:milli,
				descDate:0-milli,
				key:this.state.key,
				ref:this.state.ref
			})
			.then( data => resolve(data))
			.catch( err => reject(err))
		})
	}

	submitComment(){
		this.setState({loading:true}, event => {
			new Promise((resolve,reject) => {
				if(this.state.comment){
					if(this.state.comment.length > 0) {
						resolve(this.state.comment)
					} else {
						reject()
					}
				} else {
					reject()
				}
			})
			.then( comment => {
				this.addComment(comment)
					.then( data => {
						Actions.modal({
							header:'Complete',
							message:'Comment has been created',
							onComplete: () => { 
                checkBadgesAction({ userEmail: Actions.user.email })
                this.state.parent.componentWillLoadComments() 
              }
						})
						this.clear()
					})
			})
			.catch( err => {
				this.setState({loading:false})
				Actions.modal({
					header: 'Error',
					message: 'No comment has been entered',
					onComplete: false
				})
			})
		})
	}

	clear(){
		this.setState({comment:"", loading:false})
	}

	error(msg){
		this.state.parent.hideLoading()
		Actions.changeModal({
			header:'Error',
			message:msg
		})
		Actions.showModal()
		this.clear()
	}

	showLoading(){
		this.setState({loading:true})
	}

	hideLoading(){
		this.setState({loading:false})
	}

	render(){
		return (
			<View>
				<TextInput 
					style={inline.TextInputMultiline} 
          underlineColorAndroid='transparent'
					onChangeText={ txt=> this.setState({comment:txt})} 
					value={this.state.comment} 
					placeholder="enter comment here" 
					ref="comment" 
					autoCapitalize="sentences" 
					autoCorrect={true} 
					autoFocus={false} 
					multiline={true} 
					blurOnSubmit={true} 
					onSubmitEditing={ () => { this.submitComment() }} 
					returnKeyType="go" 
				/>
				<View style={{height:10}} />
				{
					this.state.loading ? 
						<Loader radius={true} />
						:
						<Button radius={true} text="comment" onPress={ e => { this.submitComment() }} />
				}
			</View>
		)
	}
}

const NotSignedIn = props => <View>
	<Button radius={true} text="Sign in to comment" onPress={ e => { Actions.Account() }} />
</View>

const CreateCommentComp = props => <View>
	{
		Actions.user ? <FormComp data={props.data} /> : <NotSignedIn />
	}
</View>

export default CreateCommentComp