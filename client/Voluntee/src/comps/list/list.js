import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Button,Avatar,ListItem, Subheader, Toolbar } from 'react-native-material-ui/src';
import * as firebase from 'firebase'

import {lightGreen, facebookBlue, defaultGrey, darkGreen} from '../../general/general'
import {addItemToProfile,getShareWallPostsCountByUserEmail} from '../../general/firebase'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import NextIcon from '../../assets/img/next.png'

const circle = 50
const ratio = 0.6
const borderSize = 0
const UserDescCompStyle = {
	Spacer:{
		height:4
	},
	UserImage:{
		resizeMode:'cover',
		width:circle,
		height:circle,
		borderRadius:circle/2,
		borderWidth:borderSize,
		borderColor:lightGreen
	},
	TextHeader:{
		fontSize:20,
		color:'#000',
		fontWeight:'600'
	},
	Text:{
		fontSize:12,
		color:'#000',
		fontWeight:'600'
	},
	Background:{
		backgroundColor:'#fff',
		padding:10
	},
	Divider:{
		height:1,
		backgroundColor:lightGreen
	}
}

const SingleListItem = props => {

	let headerLines = props.headerLines ? props.headerLines : 3
	let bodyLines = props.bodyLines ? props.bodyLines : 5

	let avi = <View/>

	let inner = <View style={{flex:0.85, alignItems:'flex-start'}}>
		<View style={UserDescCompStyle.Spacer} />
		<Text numberOfLines={headerLines} style={UserDescCompStyle.TextHeader}>
			{props.header}
		</Text>
		<Text numberOfLines={bodyLines} style={UserDescCompStyle.Text}>
			{props.description}
		</Text>
	</View>

	let arrow = <View style={{flex:0.15, alignItems:'flex-end', justifyContent:'center'}}>
		<Image style={{tintColor:lightGreen}} source={NextIcon} />
	</View>


	if(props.avi){
		avi = <View style={{flex:0.20, alignItems:'flex-start'}}>
			<Image style={UserDescCompStyle.UserImage} source={{uri:props.avi}} />
		</View>

		inner = <View style={{flex:0.65, alignItems:'flex-start'}}>
			<View style={UserDescCompStyle.Spacer} />
			<Text numberOfLines={headerLines} style={UserDescCompStyle.TextHeader}>
				{props.header}
			</Text>
			<Text numberOfLines={bodyLines} style={UserDescCompStyle.Text}>
				{props.description}
			</Text>
		</View>
	}

	return(
		<View>
			<TouchableOpacity style={UserDescCompStyle.Background} onPress={ e => { props.onPress() }}>
				 <View style={{flexDirection:'row',justifyContent:'center'}}>
				 	{avi}
				 	{inner}
				 	{arrow}
				</View>
			</TouchableOpacity>
			{
				props.showDivider ?
					<View style={UserDescCompStyle.Divider} />
					:
					<View/>
			}
		</View>
	)
}

export default SingleListItem

