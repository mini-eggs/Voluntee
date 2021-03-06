import React from 'react'
import {Text,ActivityIndicator,View,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import SingleListItem from '../list/list'
import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import Base from '../base/base'
import {getMessageParentForUser} from '../../general/firebase'
import {darkGreen} from '../../general/general'
import {notLoggedIn, genericError} from '../../general/userActions'

const defaultStartingState = {
  loading: true,
  page:0,
  loadingNextPage: false,
  morePages: false,
  messages: [],
  count: 10,
  descDate: null
}

const MessageListComp = props => {
  return (
    <View>
      {
        props.list.map( (item, index) => {
          let data = {
            'userDisplayName' : item.fromUserDisplayName,
            'latestMessage': item.message,
            'userAvi': item.fromUserPhoto
          }
          if(item.fromUserEmail === Actions.user.email) {
            data = {
              'userDisplayName' : item.toUserDisplayName,
              'latestMessage': item.message,
              'userAvi': item.toUserPhoto
            }
          }
          return (
            <SingleListItem 
              key={index}
              onPress={ () => { Actions.SingleMessageComp({title:data.userDisplayName, item:item})} }
              header={data.userDisplayName}
              description={data.latestMessage}
              avi={data.userAvi}
              showDivider={props.list.length > (index + 1)}
              headerLines={1}
              bodyLines={1}
            />
          )
        })
      }
    </View>
  )
}

class MessageComp extends React.Component {

  constructor(props) {
    
    super(props)
    this.state = defaultStartingState

  }

  async componentDidMount() {

    if(!Actions.user) {
      notLoggedIn()
    }

    else {
      this.componentWillGetMessages()
    }

  }

  async componentWillGetMessages() {

    const messageData = {
      userEmail: Actions.user.email,
      descDate: this.state.descDate,
      size: this.state.count
    }

    try {
      
      const msgObj = await getMessageParentForUser(messageData)
      const newMessages = [...this.state.messages, ...msgObj.items]
      const stateData = {
        loading:false, 
        descDate: msgObj.descDate, 
        morePages:msgObj.morePages, 
        messages:newMessages, 
        loadingNextPage: false
      }
      this.setState(stateData, this.checkIfWeShouldDesplayUserMessage)

    }

    catch(err) {
      if(__DEV__) {
        console.log('error in componentWillGetMessages withing messages.js Error below:')
        console.log(err)
      }
      genericError()
    }

  }

  checkIfWeShouldDesplayUserMessage() {
    if(this.state.messages.length === 0 && this.state.page === 0) {
      Actions.modal({
        header: 'Woah!',
        message: 'You have no messages at this time',
        onComplete: () => {}
      })
    }
  }

  componentWillLoadNextPage() {

    const loadNextPageData = {
      page: (this.state.page + 1),
      loadingNextPage: true
    }
    this.setState(loadNextPageData, this.componentWillGetMessages)
    
  }

  componentWillReceiveProps() {

    this.setState(defaultStartingState, this.componentWillGetMessages)

  }

  render() {
    return(
      <Base>
        {
          this.state.loading ?
            <View>
              <Loader/>
            </View>
            :
            <View>
              <MessageListComp list={this.state.messages} />
              {this.state.loadingNextPage ? <Loader/> : <View/>}
              {
                !this.state.loadingNextPage && this.state.morePages ? 
                  <Button raised primary text="MORE" onPress={ e => { this.componentWillLoadNextPage() }} /> 
                  : 
                  <View/>
              }
            </View>
          }
        </Base>
    )
  }
}

export default MessageComp

