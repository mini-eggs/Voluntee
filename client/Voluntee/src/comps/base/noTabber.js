import React from 'react'
import {View,ScrollView} from 'react-native'
import TabBar from '../tabbar/tabbar'
import ModalComp from '../modal/modal'
import {actionBarHeight,tabBarHeight} from '../../general/general'

const style = {
	container:{
        marginTop:actionBarHeight,
        flex:1
    },
    scrollview:{
    }
}

const NoTabBase = props => <View style={style.container}>
	<ScrollView
		keyboardDismissMode={'on-drag'}
		contentContainerStyle={style.scrollview}
		keyboardShouldPersistTaps={false}
		scrollEnabled={true}
		horizontal={false}
		showsVerticalScrollIndicator={false}
	>
    	{props.children}
	</ScrollView>
    <ModalComp/>
</View>

export default NoTabBase