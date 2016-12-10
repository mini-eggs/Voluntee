import React from 'react'
import {View,TouchableOpacity,Text,Image} from 'react-native'
import {lightGreen, darkGreen, actionBarHeight} from '../../general/general'

const style = {
	TouchableOpacity:{
		backgroundColor:lightGreen,
		borderRadius:0,
		paddingTop:15,
		paddingBottom:15
	},
	Text:{
		textAlign:'center',
		color:'#fff',
		fontSize:18,
		fontWeight:'600'
	}
}

getStylesBaseOnProps = props => {
	if(props.radius)
		return [style.TouchableOpacity, {borderRadius:3}]
	else
		return style.TouchableOpacity
}

const Button = props => <TouchableOpacity
	style={getStylesBaseOnProps(props)}
	onPress={props.onPress}
>
	<Text
		style={style.Text}
	>
		{props.text.toLowerCase()}
	</Text>
</TouchableOpacity>

export {Button}