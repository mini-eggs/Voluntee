import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View,ScrollView} from 'react-native'
import TabBar from '../tabbar/tabbar'
import ModalComp from '../modal/modal'
import BadgeModalComp from '../badgeModal/badgeModal'
import ActionSheetComp from '../actionSheet/actionSheet'
import {actionBarHeight,tabBarHeight,lightGreen} from '../../general/general'

const style = {
	container:{
        marginTop:actionBarHeight,
        flex:1
    },
    scrollview:{
        backgroundColor:lightGreen
    },
    spacer:{
    	height:tabBarHeight
    }
}

const base = props => <View style={style.container}>
	<ScrollView
		keyboardDismissMode={'on-drag'}
		style={style.scrollview}
		keyboardShouldPersistTaps={false}
		scrollEnabled={true}
		horizontal={false}
		showsVerticalScrollIndicator={false}
	>
    	{props.children}
    	<View style={style.spacer} />
	</ScrollView>
    <ActionSheetComp/>
    <ModalComp/>
    <BadgeModalComp/>
    <TabBar/>
</View>

export default base