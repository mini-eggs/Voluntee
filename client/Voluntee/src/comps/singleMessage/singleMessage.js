import React from 'react'
import {Text,ActivityIndicator,View,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import SingleListItem from '../list/list'
import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import Base from '../base/base'
import {getMessageThreadFromKey} from '../../general/firebase'
import {darkGreen, defaultTextColor, defaultBackgroundColor, lightGreen, screenArea, buttonHeight, screenWidth} from '../../general/general'
import {notLoggedIn, genericError} from '../../general/userActions'

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
  Background:{
    backgroundColor:defaultBackgroundColor,
    minHeight: screenArea,
    padding:5
  },
  TextBubble:{
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

    // TODO
    // add ability to remove
    // a convo

    Actions.moreOptionsRightButton = props => this.showOptions()

  }

  showOptions() {

    const options = [
      'remove convo',
      'hide convo',
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

    switch(index) {
      case 0: 
        console.log('remove convo')
        break;
      case 1: 
        console.log('hide convo')
        break;
      case 2: 
        console.log('block user')
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
            <View>
              <MessageListComp list={this.state.messages} />
              <View style={{marginTop: ( -1 * buttonHeight )}} />
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

