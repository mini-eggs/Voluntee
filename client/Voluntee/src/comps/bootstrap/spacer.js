import React from 'react'
import {View} from 'react-native'
import style from './style'

const Spacer = props => <View style={{flex:1}}>
	<View style={style.spacer}>
		{props.children}
	</View>
</View>
export {Spacer}