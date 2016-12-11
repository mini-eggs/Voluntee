import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Button,Avatar,ListItem} from 'react-native-material-ui'

import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'
import {blockUserAction} from '../../general/userActions'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {style} from './style'

const circle = 50
const ratio = 0.6
const borderSize = 0
const UserDescCompStyle = {
	Spacer:{
		height:5
	},
	Container:{
		borderColor:lightGreen,
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
	Text:{
		fontSize:16,
		color:'#000',
		fontWeight:'600'
	},
	Divider:{
		height:15
	}
}

const buttons = ['message user', 'report comment', 'hide comment', 'block user', 'dismiss']

const onCommentButtonPress = async props => {

	// @props
	// index
	// comment
	// @

	const index = parseInt(props.index)

	switch(index) {
		case 0:
			if(__DEV__) {
				console.log('send user a message')
				console.log(props.comment)
			}
			break;
		case 1:
			if(__DEV__) {
				console.log('report the comment')
				console.log(props.comment)
			}
			break;
		case 2:
			if(__DEV__) {
				console.log('hide the comment')
				console.log(props.comment)
			}
			break;
		case 3:
			if(__DEV__) {
				console.log('block the user')
				console.log(props.comment)
			}
			const blockData = {
				userEmail: Actions.user.email,
				userBlocked: props.comment.userEmail,
				userBlockedDisplayName: props.comment.userDisplayName
			}
			blockUserAction(blockData)
			break;
		default:
			// do nothing
			// dismiss was pressed
			break;
	}
}

const showCommentOptions = comment => {
	// @props
	// comment object from firebase
	// @
	// check user status
	// if user is signed in show
	// options for comment, report/etc
	// if not tell user they need to sign in
	if(Actions.user) {
		Actions.ActionSheet({
	        onComplete: index => onCommentButtonPress({index:index, comment:comment}),
	        buttons: buttons,
	        title: 'comment options',
	        cancelIndex:4
	    })
	}
	// otherwise tell them to 
	// get out!!!!!
	else {
		Actions.changeModal({
			header: 'Not allowed',
			message: 'Please sign in to interact with comments',
			onComplete:() => {}
		})
		Actions.showModal()
	}
}

const SingleComment = props => <View>
	<TouchableOpacity style={{flexDirection:'row',justifyContent:'center'}} onPress={ () => { showCommentOptions(props.comment) }} >
		<View style={{flex:0.25}}>
			<Image style={UserDescCompStyle.UserImage} source={{uri:props.comment.userPhoto}} />
		</View>
		<View style={{flex:0.75}}>
			<View style={UserDescCompStyle.Spacer} />
			<Text numberOfLines={1} style={UserDescCompStyle.Text}>{props.comment.userDisplayName}:</Text>
			<Text style={UserDescCompStyle.Text}>{props.comment.comment}</Text>
		</View>
	</TouchableOpacity>
	{
		props.showDivider ?
			<View style={UserDescCompStyle.Divider} />
			:
			<View/>
	}
</View>

const CommentSectionComp = props => <View style={UserDescCompStyle.Container}>
	{
		props.comments.map( (comment, index) => <SingleComment key={index} showDivider={props.comments.length > (index + 1)} comment={comment} />)
	}
</View>

export default CommentSectionComp