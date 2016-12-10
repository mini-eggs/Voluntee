import React from 'react'
import {View,TouchableOpacity,Text,Image} from 'react-native'
import {lightGreen, darkGreen, actionBarHeight} from '../../general/general'

const style = {
	TouchableOpacity:{
		backgroundColor:'transparent',
		borderRadius:3,
		paddingTop:15,
		paddingBottom:15,
		borderWidth:3,
		borderColor:lightGreen
	},
	Text:{
		textAlign:'center',
		color:lightGreen,
		fontSize:18,
		fontWeight:'600'
	}
}

const Button = props => <TouchableOpacity
	style={style.TouchableOpacity}
	onPress={props.onPress}
>
	<Text
		style={style.Text}
	>
		{props.text.toLowerCase()}
	</Text>
</TouchableOpacity>

export {Button}