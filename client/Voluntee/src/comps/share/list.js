import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Button,Avatar,ListItem, Subheader, Toolbar } from 'react-native-material-ui/src';
import * as firebase from 'firebase'

import SingleListItem from '../list/list'
import {lightGreen, facebookBlue, defaultGrey} from '../../general/general'
import {addItemToProfile,getShareWallPostsCountByUserEmail} from '../../general/firebase'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import NextIcon from '../../assets/img/next.png'

const ListComp = props => <View>
	{
		props.list.map( (item, index) => {
			return <SingleListItem 
				key={index}
				onPress={ e => { Actions.SingleShare({title:item.title, post:item}) }}
				header={item.title}
				description={item.description}
				avi={item.userPhoto}
				showDivider={props.list.length > (index + 1)}
				headerLines={1}
				bodyLines={1}
			/>
		})
	}
</View>

export default ListComp