import React from 'react'
import {Text,ActivityIndicator,View,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import SingleListItem from '../list/list'
import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import Base from '../base/base'
import {getMessageThreadFromKey} from '../../general/firebase'
import {darkGreen, defaultTextColor, defaultBackgroundColor, lightGreen, screenArea} from '../../general/general'
import {notLoggedIn, genericError} from '../../general/userActions'

const style = {
  BubbleTextWrap:{
    backgroundColor:lightGreen,
    padding:5,
    paddingLeft:15, 
    paddingRight:15, 
    borderRadius:15
  },
  Text:{
    color:defaultTextColor
  },
  Background:{
    backgroundColor:defaultBackgroundColor,
    minHeight: screenArea,
    flex:1
  },
  TextBubble:{
  },
  Container:{
    padding:10,
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
    this.state = {
      loading: true,
      messages: [],
      key:props.item.commentKey
    }
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
            <MessageListComp list={this.state.messages} />
        }
      </Base>
    )
  }
}

export default SingleMessageComp

