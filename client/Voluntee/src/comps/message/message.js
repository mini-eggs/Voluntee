import React from 'react'
import {Text,ActivityIndicator,View,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import Base from '../base/base'
import {getMessagesByUserEmailAndDescDate} from '../../general/firebase'
import {darkGreen} from '../../general/general'

const defaultStartingState = {
  loading: true,
  loadingNextPage: false,
  morePages: false,
  events: [],
  page: 0,
  count: 10,
  descDate: null
}

class MessageComp extends React.Component {

  constructor(props) {
    super(props)
    this.state = defaultStartingState
  }

  async componentDidMount() {

    if(!Actions.user) {
      Actions.modal({
        header: 'No user',
        message: 'Please sign in to continue',
        onComplete: event => Actions.Account()
      })
    }

    else {
      this.componentWillGetMessages()
    }
  }

  async componentWillGetMessages() {

    // const getMessagesData = {
    //   userEmail: Actions.user.email,
    //   descDate: this.state.descDate
    // }
    // const messages = getMessagesByUserEmailAndDescDate(getMessagesData)

    // messages.then(messages => {
    //   if(__DEV__) console.log(message)
    // })

    // messages.catch(err => {
    //   if(__DEV__) console.log(err)
    //   this.setState({loading:false, loadingNextPage:false, morePages:false})
    //   Actions.modal({
    //     header: 'Error',
    //     message: 'Opps, something went wrong',
    //     onComplete: () => {}
    //   })
    // })

    // let data = {zip:this.state.zip,page:this.state.page}
    // searchOpportunities(data)
    //     .then( events => {
    //         let newEventsArr = [...this.state.events, ...events]
    //         let morePages = (events.length >= 10)
    //         this.setState({events:newEventsArr,loading:false,loadingNextPage:false, morePages:morePages})
    //     })
    //     .catch( err => console.log(err))
  }

  componentWillLoadNextPage() {
    const loadNextPageData = {
      page: (this.state.page + 1),
      loadingNextPage: true
    }
    this.setState(loadNextPageData, this.componentWillGetMessages)
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
              <EventListComp list={this.state.events} />
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

