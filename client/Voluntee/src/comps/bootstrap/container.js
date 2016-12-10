import React from 'react'
import {View} from 'react-native'

const Container = props => <View style={{flex:1,flexDirection:'row'}}>
	{props.children}
</View>
export {Container}