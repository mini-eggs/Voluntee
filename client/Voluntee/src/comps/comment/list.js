import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Button,Avatar,ListItem} from 'react-native-material-ui'
import * as Firebase from 'firebase'

import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'
import {blockUserAction, removeCommentByKeyAction, hideCommentAction, reportCommentAction} from '../../general/userActions'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {style} from './style'
import {checkBadgesAction} from '../../general/userActions'

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
const buttonsAlt = ['remove comment', 'dismiss']

const onCommentButtonPress = async props => {
	// @props
	// index
	// comment
	// parent
	// @
	const index = parseInt(props.index)
	switch(index) {
		case 0:
			//message user
			const messageData = {
				title: props.comment.userDisplayName,
				to: {
					userDisplayName: props.comment.userDisplayName,
					userEmail: props.comment.userEmail,
					userPhoto: props.comment.userPhoto
				}
			}
			Actions.CreateMessage(messageData)
			break;
		case 1:
			// report comment
			const reportedCommentData = {
				key: props.comment.commentKey,
				userEmail: Actions.user.email,
        onComplete: () => { checkBadgesAction({ userEmail: Actions.user.email }) }
			}
			reportCommentAction(reportedCommentData)
			break;
		case 2:
			// hide comment
			const hideCommentData = {
				key: props.comment.commentKey,
				userEmail: Actions.user.email,
				onComplete: () => { props.parent.componentWillLoadComments() }
			}
			hideCommentAction(hideCommentData)
			break;
		case 3:
			const blockData = {
				userEmail: Actions.user.email,
				userBlocked: props.comment.userEmail,
				userBlockedDisplayName: props.comment.userDisplayName,
				onComplete: () => { props.parent.componentWillLoadComments() }
			}
			blockUserAction(blockData)
			break;
		default:
			// do nothing
			// dismiss was pressed
			break;
	}
}

// this method is for
// deleting the user's own
// comment
// maybe more in the future	
const onCommentButtonPressAlt = async props => {
	const index = parseInt(props.index)
	switch(index) {
		case 0:
			const removeData = {
				key: props.comment.commentKey,
				onComplete: () => { props.parent.componentWillLoadComments() }
			}
			removeCommentByKeyAction(removeData)
			break;
		case 1:
		default:
			break;
	}
}

const showCommentOptions = props => {
	// @props
	// comment object from firebase
	// @
	// check user status
	// if user is signed in show
	// options for comment, report/etc
	// if not tell user they need to sign in
	const comment = props.comment
	const parent = props.parent
	if(Actions.user) {
		if(Actions.user.email === comment.userEmail) {
			Actions.ActionSheet({
		        onComplete: index => onCommentButtonPressAlt({index:index, comment:comment, parent:parent}),
		        buttons: buttonsAlt,
		        title: 'comment options',
		        cancelIndex:1
		    })
		}
		else {
			Actions.ActionSheet({
		        onComplete: index => onCommentButtonPress({index:index, comment:comment, parent:parent}),
		        buttons: buttons,
		        title: 'comment options',
		        cancelIndex:4
		    })
		}
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
	<TouchableOpacity 
		style={{flexDirection:'row',justifyContent:'center'}} 
		onPress={ () => { 
			showCommentOptions({comment:props.comment, parent:props.parent}) 
		}} 
	>
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
		props.data.comments.map( (comment, index) => 
			<SingleComment 
				key={index} 
				showDivider={props.data.comments.length > (index + 1)} 
				comment={comment} 
				parent={props.data.parent}
				/>
		)
	}
</View>

export default CommentSectionComp