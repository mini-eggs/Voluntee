import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Avatar,ListItem} from 'react-native-material-ui'
import * as firebase from 'firebase'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {getShareWallPostsByDescDateAndCount} from '../../general/firebase'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'
import Base from '../base/base'
import {style} from './style'
import CommentComp from '../comment/comment'
import {blockUserAction,reportPostAction, hidePostAction,checkBadgesAction,removePostAction,notLoggedIn} from '../../general/userActions'


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
        padding:10,
        borderRadius:3
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
    },
    Divider:{
        height:10
    }
}

class ShareSingle extends React.Component {

	constructor(props){
		super(props)
    this.registerEvents()
		this.state = {
			item:props.post
		}
	}

  componentDidMount() {
    this.registerEvents()
  }

  registerEvents() {
    Actions.moreOptionsRightButton = () => { this.showOptions() }
  }

  showOptions() {

    const options = [
      'report post',
      'hide post',
      'block user',
      'dismiss'
    ]
    
    const optionsAlt = [
      'remove post',
      'dismiss'
    ]

    const onComplete = index => { this.userHasChosenOption({index:index}) }

    let optionsChoice = options
    let indexChoice = 3
    let onCompleteChoice = onComplete

    if(Actions.user) {
      if(Actions.user.email === this.state.item.userEmail) {
        optionsChoice = optionsAlt
        indexChoice = 1
        onCompleteChoice = index => { this.userHasChosenOptionAsAuthor({index:index}) }
      }
    }

    Actions.ActionSheet({
      onComplete: index => { onCompleteChoice(index) },
      buttons: optionsChoice,
      title: 'post options',
      cancelIndex: indexChoice
    })

  }

  userHasChosenOptionAsAuthor(props) {

    const index = parseInt(props.index)
    const item = this.state.item

    switch(index) {

      case 0: 
        const removePostData = { 
          key: item.postKey,
          title: item.title,
          onComplete: () => { Actions.popRefresh() }
        }
        removePostAction(removePostData)
        break;

      default:
        break;
    }

  }

  userHasChosenOption(props) {

    const index = parseInt(props.index)
    const item = this.state.item

    if(!Actions.user && index !== 3) {
      notLoggedIn()
    }

    else {
      switch(index) {

        case 0: 
          const reportPostData = {
            userEmail: Actions.user.email,
            key: item.postKey,
            title: item.title,
            onComplete: () => { checkBadgesAction({ userEmail: Actions.user.email }) }
          }
          reportPostAction(reportPostData)
          break;

        case 1: 
          const hidePostData = {
            userEmail: Actions.user.email,
            key: item.postKey,
            title: item.title,
            onComplete: () => { Actions.popRefresh() }
          }
          hidePostAction(hidePostData)
          break;

        case 2: 
          const blockData = {
            userEmail: Actions.user.email,
            userBlocked: item.userEmail,
            userBlockedDisplayName: item.userDisplayName,
            onComplete: () => { Actions.popRefresh() }
          }
          blockUserAction(blockData)
          break;

        default:
          break;
      }
    }
  }

  componentWillReceiveProps(props) {
      this.setState({item:props.post})
  }

  render() {
    return (
      <Base>
        <View style={inline.Background}>
          <View style={UserDescCompStyle.Container}>
            <View style={{flexDirection:'row',justifyContent:'center'}}>
              <View style={{flex:0.25}}>
                <Image style={UserDescCompStyle.UserImage} source={{uri:this.state.item.userPhoto}} />
              </View>
              <View style={{flex:0.75}}>
              <View style={UserDescCompStyle.Spacer} />
                <Text numberOfLines={1} style={UserDescCompStyle.Text}>{this.state.item.userDisplayName}</Text>
                <Text numberOfLines={1} style={UserDescCompStyle.Text}>{this.state.item.userEmail}</Text>
              </View>
            </View>
            <View style={inline.Divider} />
            <View>
              <Text style={style.TextTitle}>
                {this.state.item.title}
              </Text>
              <Text style={style.Text}>
                {this.state.item.description}
              </Text>
            </View>
          </View>
          <View style={{margin:10, marginTop:0}}>
            <CommentComp data={{ref:'posts', key:this.state.item.postKey}} />
          </View>
        </View>
    	</Base>
    )
  }
}

export default ShareSingle