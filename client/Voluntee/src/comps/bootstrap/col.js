import React from 'react'
import {View} from 'react-native'
import style from './style'

const ColThree = props => <View style={{flex:0.25}}>
	<View style={style.margin}>
		{props.children}
	</View>
</View>
export {ColThree}

const ColSix = props => <View style={{flex:0.5}}>
	<View style={style.margin}>
		{props.children}
	</View>
</View>
export {ColSix}

const ColTwelve = props => <View style={{flex:1}}>
	<View style={style.margin}>
		{props.children}
	</View>
</View>
export {ColTwelve}