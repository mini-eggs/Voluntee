import React from 'react'
import {View,TouchableOpacity,Text,Image} from 'react-native'
import Tabbar from 'react-native-tabbar'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {lightGreen, actionBarHeight, tabbarOffset} from '../../general/general'
import {Actions} from 'react-native-router-flux'

const style = {
	tabbies:{
		backgroundColor:lightGreen,
    marginTop: -1 * tabbarOffset,
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
      color: '#fff',
  		height:35
  	}
}

const GetIconTab = props => {
  return (
    <TouchableOpacity style={style.tabItem} onPress={ event => { props.complete() }}>
      <MaterialIcons 
        name={props.icon}
        size={35}
        color={style.icon.color}
      />
    </TouchableOpacity>
  )
}

const tabs = [
	{text:'discover', icon: 'visibility', complete: event => { Actions.Discover()} },
	{text:'saved', icon: 'loyalty', complete: event => { Actions.Saved()} },
	{text:'badges', icon: 'pages', complete: event => { Actions.Badges()} },
	{text:'share', icon: 'forum', complete: event => { Actions.Share()} },
	{text:'account', icon: 'settings', complete: event => { Actions.Account()} }
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
