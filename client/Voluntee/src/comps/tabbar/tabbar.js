import React from 'react'
import {View,TouchableOpacity,Text,Image} from 'react-native'
import Tabbar from 'react-native-tabbar'

import {lightGreen, actionBarHeight} from '../../general/general'
import {Actions} from 'react-native-router-flux'

import VisibilityIcon from '../../assets/img/visibility.png'
import LoyaltyIcon from '../../assets/img/loyalty.png'
import PagesIcon from '../../assets/img/pages.png'
import ForumIcon from '../../assets/img/forum.png'
import SettingsIcon from '../../assets/img/settings.png'

const style = {
	tabbies:{
		backgroundColor:lightGreen,
		marginTop: -1 * actionBarHeight
	},
	tabItem: {
    	flex: 1,
    	alignItems: 'center',
    	justifyContent: 'center'
  	},
  	text:{
  		color:'#fff',
  		fontSize:12,
  		textAlign :'center',
  		zIndex:1
  	},
  	icon:{
  		// height:27,
  		// marginBottom:-2,
  		// zIndex:9
  		height:35
  	}
}

// const GetIconTab = props => <TouchableOpacity style={style.tabItem} onPress={ event => { props.complete() }}>
// 	<View>
// 		<Image resizeMode={'contain'} style={style.icon} source={props.icon} />
// 		<Text style={style.text}>
// 			{props.text}
// 		</Text>
// 	</View>
// </TouchableOpacity>

const GetIconTab = props => <TouchableOpacity style={style.tabItem} onPress={ event => { props.complete() }}>
	<View>
		<Image resizeMode={'contain'} style={style.icon} source={props.icon} />
	</View>
</TouchableOpacity>

const tabs = [
	{text:'discover', icon: VisibilityIcon, complete: event => { Actions.Discover()} },
	{text:'saved', icon: LoyaltyIcon, complete: event => { Actions.Saved()} },
	{text:'badges', icon: PagesIcon, complete: event => { Actions.Badges()} },
	{text:'share', icon: ForumIcon, complete: event => { Actions.Share()} },
	{text:'account', icon: SettingsIcon, complete: event => { Actions.Account()} }
]

const tabbies = props => {
	return (
		<Tabbar show={true} style={style.tabbies} >
			<View style={{flex:1,flexDirection:'row'}}>
				{tabs.map( (tab,index) => <GetIconTab key={index} {...tab} /> )}
		    </View>
		</Tabbar>
	)
}

export default tabbies