import React from 'react'
import {Text,ActivityIndicator,View,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'
import * as firebase from 'firebase'

import SingleListItem from '../list/list'
import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import Base from '../base/base'
import {getMessageThreadFromKey} from '../../general/firebase'
import {darkGreen, defaultTextColor, defaultBackgroundColor, lightGreen, screenArea, buttonHeight, screenWidth} from '../../general/general'
import {notLoggedIn, genericError, removeConvoAction, hideConvoAction, blockUserAction, reportUserAction} from '../../general/userActions'

const goToCreateMessageComp = props => {

  const item = props.item

  let user = {
    userDisplayName: item.toUserDisplayName,
    userEmail: item.toUserEmail,
    userPhoto: item.toUserPhoto,
  }

  if(user.userEmail === Actions.user.email) {

    user = {
      userDisplayName: item.fromUserDisplayName,
      userEmail: item.fromUserEmail,
      userPhoto: item.fromUserPhoto,
    }

  }

  const messageData = {
    title: user.userDisplayName,
    to: user,
    commentKey: props.key
  }

  Actions.CreateMessage(messageData)

}

const style = {
  AllMessagesContainer: {
  },
  BubbleTextWrap:{
    backgroundColor:lightGreen,
    padding:5,
    paddingLeft:15, 
    paddingRight:15, 
    borderRadius:15,
    maxWidth: (screenWidth * 0.70)
  },
  Text:{
    color:defaultTextColor
  },
  ContainerBackground: {
  },
  Background:{
    backgroundColor:defaultBackgroundColor,
    minHeight: screenArea - buttonHeight,
    padding:5,
    paddingTop:105
  },
  TextBubble:{
    marginBottom:100,
    marginTop: -100
  },
  Container:{
    padding:5,
    paddingLeft:0, 
    paddingRight:0,
    backgroundColor:defaultBackgroundColor,
  },
  PositionRight:{
    flexDirection:'column',
    alignItems:'flex-end'
  },
  PositionLeft:{
    flexDirection:'column',
    alignItems:'flex-start'
  }
}

const TextBubble = props => {

  const msg = props.item
  let position = style.PositionLeft

  if(msg.fromUserEmail === Actions.user.email) {
    position = style.PositionRight
  }

  return (
    <View style={style.Container}>
      <View style={style.TextBubble}>
        <View style={position}>
          <View style={style.BubbleTextWrap}>
            <Text style={style.Text}>{msg.message}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const MessageListComp = props => {
  // @props
  // list
  // @
  return (
    <View style={style.Background}>
      {
        props.list.map((item, index) => {
          return (
            <TextBubble key={index} item={item} />
          )
        })
      }
    </View>
  )
}

class SingleMessageComp extends React.Component {

  constructor(props) {
    super(props)
    this.setEvents()
    this.state = {
      loading: true,
      messages: [],
      key:props.item.commentKey,
      item: props.item
    }
  }

  setEvents() {

    Actions.moreOptionsRightButton = props => this.showOptions()

  }

  showOptions() {

    const options = [
      'report user',
      'remove convo',
      'block user',
      'dismiss'
    ]

    Actions.ActionSheet({
      onComplete: index => { this.userHasChosenOption({index:index}) },
      buttons: options,
      title: 'convo options',
      cancelIndex: 3
    })

  }

  userHasChosenOption(props) {

    const index = parseInt(props.index)
    const item = this.state.item

    switch(index) {

      case 0: 
        // report user
        const reportData = {
          userEmail: Actions.user.email,
          userReportedEmail: item.fromUserEmail === firebase.auth().currentUser.email ? item.toUserEmail : item.fromUserEmail,
          userReportedDisplayName: item.fromUserDisplayName === firebase.auth().currentUser.displayName ? item.toUserDisplayName : item.fromUserDisplayName,
          onComplete: () => {}
        }
        reportUserAction(reportData)
        break;

      case 1: 
        const hideConvoData = {
          key: item.commentKey,
          userEmail: Actions.user.email,
          onComplete: () => { Actions.popRefresh() }
        }
        hideConvoAction(hideConvoData)
        break;

      case 2: 
        const blockData = {
          userEmail: Actions.user.email,
          userBlocked: item.fromUserEmail === firebase.auth().currentUser.email ? item.toUserEmail : item.fromUserEmail,
          userBlockedDisplayName: item.fromUserDisplayName === firebase.auth().currentUser.displayName ? item.toUserDisplayName : item.fromUserDisplayName,
          onComplete: () => { Actions.popRefresh() }
        }
        blockUserAction(blockData)
        break;

      default:
        break;
    }

  }

  componentWillReceiveProps() {

    this.loadCommentThread()

  }

  async componentDidMount() {
    if(!Actions.user) 
      notLoggedIn()
    else 
      this.loadCommentThread()
  }

  async loadCommentThread() {
    try {
      const data = {key:this.state.key}
      const messages = await getMessageThreadFromKey(data)
      this.setState({messages:messages, loading:false})
    }
    catch(err) {
      if(__DEV__) {
        console.log('Error in loadCommentThread within singleMessage.js. Error below')
        console.log(err)
      }
      genericError()
    }
  }

  render() {
    return(
      <Base>
        {
          this.state.loading ?
            <Loader/>            
            :
            <View style={style.ContainerBackground}>
              <MessageListComp list={this.state.messages} />
              <Button 
                onPress={ () => { goToCreateMessageComp({item:this.state.item, key:this.state.key}) } }
                text='New Message'
              />
            </View>
        }
      </Base>
    )
  }
}

export default SingleMessageComp

