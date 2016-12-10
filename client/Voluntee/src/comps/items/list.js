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

const EventListParentComp = props => {
	return (
		<View>
			{
				props.list.map( (item, index) => {
					return <SingleListItem 
						key={index}
						onPress={ e => { Actions.SingleEvent({title:item.name, post:item}) }}
						header={item.name}
						description={item.desc}
						showDivider={props.list.length > (index + 1)}
						headerLines={3}
						bodyLines={5}
					/>
				})
			}
		</View>
	)
}

export default EventListParentComp