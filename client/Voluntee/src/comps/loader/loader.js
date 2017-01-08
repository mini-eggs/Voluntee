import React from 'react'
import {View,ActivityIndicator,Text,Image} from 'react-native'
import {lightGreen, darkGreen, actionBarHeight, buttonHeight} from '../../general/general'

const style = {
	View:{
		backgroundColor:lightGreen,
    minHeight: buttonHeight,
		borderRadius:0,
		paddingTop:15.5,
		paddingBottom:16
	},
	ActivityIndicator:{
		paddingTop: 1,
		paddingBottom: 1
	}
}

getStylesBaseOnProps = props => {
	if(props.radius)
		return [style.View, {borderRadius:3}]
	else
		return style.View
}

const Loader = props => <View
	style={getStylesBaseOnProps(props)}
>
	<ActivityIndicator
		color='#fff'
		style={style.ActivityIndicator}
	/>
</View>

export {Loader}