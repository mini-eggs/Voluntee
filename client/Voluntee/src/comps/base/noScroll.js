import React from 'react'
import {View,ScrollView} from 'react-native'
import TabBar from '../tabbar/tabbar'
import ModalComp from '../modal/modal'
import BadgeModalComp from '../badgeModal/badgeModal'
import {actionBarHeight,tabBarHeight,lightGreen,screenArea,screenHeight} from '../../general/general'

const style = {
	container:{
        marginTop:actionBarHeight,
        flex:1
    },
    noScroll:{
        backgroundColor:lightGreen,
        flex:1
    }
}

const base = props => 

	<View style={style.container}>
		<View style={style.noScroll}>
	    	{props.children}
		</View>
	  <ModalComp/>
    <BadgeModalComp/>
	</View>

export default base