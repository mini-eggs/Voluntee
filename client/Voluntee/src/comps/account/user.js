import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Base from '../base/base'
import {Avatar} from 'react-native-material-ui'
import * as firebase from 'firebase'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'
import {addItemToProfile,getShareWallPostsCountByUserEmail,getDatabaseCategoryCountByRefAndTypeAndUserEmail} from '../../general/firebase'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {style} from './style'

const circle = 50
const ratio = 0.6
const borderSize = 2
const UserDescCompStyle = {
	Spacer:{
		height:4
	},
	Container:{
		backgroundColor:lightGreen,
		margin:10,
		marginBottom:0,
		paddingBottom:10,
		padding:10,
		borderRadius:0,
		borderTopLeftRadius:3,
		borderTopRightRadius:3
	},
	Image:{
		height:circle * ratio - borderSize * 2,
		width:circle * ratio - borderSize * 2,
		marginLeft: ( (circle/2) * (1 - ratio) )
	},
	Cirlce:{
		backgroundColor:lightGreen,
		width:circle,
		height:circle,
		borderRadius:circle/2,
		flex:1,
		alignItem:'center',
		justifyContent:'center',
		borderWidth:borderSize,
		borderColor:'#fff'
	},
	UserImage:{
		resizeMode:'cover',
		width:circle,
		height:circle,
		borderRadius:circle/2,
		borderWidth:borderSize,
		borderColor:'#fff'
	},
	ActivityIndicator:{
	},
	Text:{
		fontSize:16,
		color:'#fff',
		fontWeight:'600'
	}
}

const inline = {
	Background:{
		backgroundColor:'#fff',
		minHeight:screenArea
	},
	userImage:{
		flexDirection:'row',
		alignItem:'center',
		justifyContent:'center',
		marginTop:15, 
		marginBottom:15
	},
	Border:{
		borderColor:"#fff"
	},
	TextInput:{
		height:40,
		fontSize:18,
		borderColor:lightGreen,
		borderRadius:3,
		margin:0,
		padding:10,
		borderWidth:3
	}
}

class UserComp extends React.Component {

	constructor(props) {
		super(props)

		if(__DEV__) {
			console.log('firebase user below:')
			console.log(firebase.auth().currentUser)
		}

		this.state = {
			shareWallPosts:null,
			eventsComplete:null,
			commentsNum:null,
			badgesEarned:null,
			username:firebase.auth().currentUser.displayName,
			email:firebase.auth().currentUser.email,
			photo:firebase.auth().currentUser.photoURL,
			parent:props.parent
		}
	}

	async componentDidMount() {
		// through all the data together
		// and iterate through to make
		// it looks prettier in this chiccy
		const data = [
			{state: 'shareWallPosts',data: {ref:'posts', type:'userEmail', email:Actions.user.email}},
			{state: 'commentsNum',data: {ref:'comments', type:'userEmail', email:Actions.user.email}},
			{state: 'eventsComplete',data: {ref:'savedEvents', type:'userEmail', email:Actions.user.email}}
		]
		// do the iteratring
		data.forEach( async data => {
			// awaits the junks bro
			try {
				const count = await getDatabaseCategoryCountByRefAndTypeAndUserEmail(data.data)
				const currentState = this.state
				currentState[data.state] = count.toString()
				this.setState(currentState)
			}
			// do something about errorss
			// haven't encountered on yet
			// but you always do 
			catch(err) {
				if(__DEV__) {
					console.log('something went wrong componentDidMount - user.js')
				}
			}
		})
	}

  	render() {
  		return (
  			<View>
  				<View style={inline.Background}>
  					<View style={UserDescCompStyle.Container}>
  						<View style={{flexDirection:'row',justifyContent:'center'}}>
  							<View style={{flex:0.25}}>
						  		<Image style={UserDescCompStyle.UserImage} source={{uri:this.state.photo}} />
				  			</View>
				  			<View style={{flex:0.75}}>
				  				<View style={UserDescCompStyle.Spacer} />
				  				<Text numberOfLines={1} style={UserDescCompStyle.Text}>{this.state.username}</Text>
				  				<Text numberOfLines={1} style={UserDescCompStyle.Text}>{this.state.email}</Text>
				  			</View>
			  			</View>
  					</View>

  					<View style={{marginLeft:10, marginRight:10}}>
	  					<View style={{flexDirection:'row'}}>
	  						<View style={{flex:0.5}}>
	  							<View style={{backgroundColor:lightGreen, padding:10, borderRadius:0, marginRight:0}}>
	  								<Text style={style.TextCenter}>share wall</Text>
	  								<Text style={style.TextCenter}>posts</Text>
	  								<View style={{height:5}}/>
	  								{
	  									this.state.shareWallPosts ?
	  										<Text style={style.metric}>{this.state.shareWallPosts}</Text>
	  										:
	  										<ActivityIndicator style={{marginTop:6.75,marginBottom:6.75}} color="#fff" />
	  								}
	  							</View>
	  						</View>
	  						<View style={{flex:0.5}}>
	  							<View style={{backgroundColor:lightGreen, padding:10, borderRadius:0, marginLeft:0}}>
	  								<Text style={style.TextCenter}>events</Text>
	  								<Text style={style.TextCenter}>saved</Text>
	  								<View style={{height:5}}/>
	  								{
	  									this.state.eventsComplete ?
	  										<Text style={style.metric}>{this.state.eventsComplete}</Text>
	  										:
	  										<ActivityIndicator style={{marginTop:6.75,marginBottom:6.75}} color="#fff" />
	  								}
	  							</View>
	  						</View>
	  					</View>

	  					<View style={{flexDirection:'row'}}>
	  						<View style={{flex:0.5}}>
	  							<View style={{backgroundColor:lightGreen, padding:10, borderRadius:0, borderBottomLeftRadius:3, marginRight:0}}>
	  								<Text style={style.TextCenter}>number of</Text>
	  								<Text style={style.TextCenter}>comments</Text>
	  								<View style={{height:5}}/>
	  								{
	  									this.state.commentsNum ?
	  										<Text style={style.metric}>{this.state.commentsNum}</Text>
	  										:
	  										<ActivityIndicator style={{marginTop:6.75,marginBottom:6.75}} color="#fff" />
	  								}
	  							</View>
	  						</View>
	  						<View style={{flex:0.5}}>
	  							<View style={{backgroundColor:lightGreen, padding:10, borderRadius:0, borderBottomRightRadius:3, marginLeft:0}}>
	  								<Text style={style.TextCenter}>badges</Text>
	  								<Text style={style.TextCenter}>earned</Text>
	  								<View style={{height:5}}/>
	  								{
	  									this.state.badgesEarned ?
	  										<Text style={style.metric}>{this.state.badgesEarned}</Text>
	  										:
	  										<ActivityIndicator style={{marginTop:6.75,marginBottom:6.75}} color="#fff" />
	  								}
	  							</View>
	  						</View>
	  					</View>
  					</View>

  					<View style={{margin:10}}>
  						<Button radius={true} text="logout" onPress={ e => { this.state.parent.logout() }} />
  					</View>
  				</View>
  			</View>
  		)
  	}
}

export default UserComp