import React from 'react'
import {Text,ActivityIndicator,View,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import {displayListOnMap} from '../map/general'

import Base from '../base/base'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {getHelloWorldFromVolunteerMatch,searchOpportunities} from '../../general/volunteerMatch'
import {getLocation, getZipFromLatAndLong} from '../../general/geo'
import {darkGreen} from '../../general/general'
import {noInternetConnection} from '../../general/userActions'
import EventListComp from './list'

const style = {
  Text: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontWeight: '600'
  },
  TextLeft: {
    fontSize: 18
  },
  TextInput: {
    // height:51.5,
    height: 53,
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontWeight: '600'
  }
}

class Items extends React.Component {

  constructor(props) {
    // set up extended comp
    super(props)
    // register left map button
    // to use this component
    Actions.ViewEventsOnMap = () => {
      // view all current events
      // in map component
      displayListOnMap({
        events: this.state.events
      })
    }
    // get initial state
    this.state = {
      loading: true,
      loadingNextPage: false,
      morePages: true,
      zip: null,
      userInputZip: null,
      page: 0,
      events: [],
      userWantsToChangeZip: false,
      noInternet: false
    }
  }

  componentDidMount() {
    this.initializeSearch()
  }

  async initializeSearch() {
    getLocation()
      .then( loc => {
        getZipFromLatAndLong({ lat: loc.coords.latitude, long: loc.coords.longitude })
          .then( zip => {
            this.componentWillReceiveZip(zip.postalCodes[0].postalCode)
          })
          .catch( err => {
            if(__DEV__) {
              console.log('Error in componentDidMount within items.js, error below: ')
              console.log(err)
            }
            noInternetConnection()
              .then( () => {
                this.setState({ loading: false, noInternet: true })
              })
          })

      })
      .catch( err => {
        if(__DEV__) {
          console.log('Error in componentDidMount within items.js, error below: ')
          console.log(err)
        }
        Actions.modal({
          header: 'Woah!',
          message: 'Could not retreive current zip. Make sure locations are enabled.',
          onComplete: () => {
            this.setState({ zip: '00000', loading: false, morePages: false, userWantsToChangeZip: true })
          }
        })
      })
  }

  componentWillReceiveZip(zip) {
    this.setState({
      zip: zip
    }, this.componentWillSearchOpportunities)
  }

  async componentWillSearchOpportunities() {
    let data = {
      zip: this.state.zip,
      page: this.state.page
    }
    searchOpportunities(data)
      .then(events => {
        let newEventsArr = [...this.state.events, ...events]
        let morePages = (events.length >= 10)
        this.setState({
          events: newEventsArr,
          loading: false,
          loadingNextPage: false,
          morePages: morePages
        })
      })
      .catch(err => console.log(err))
  }

  componentWillLoadNextPage() {
    const newState = {
      page: (this.state.page + 1),
      loadingNextPage: true
    }
    this.setState(newState, this.componentWillSearchOpportunities)
  }

  componentWillChangeZip(zip) {
    if(!zip) {
      return false
    }
    else if(zip.toString().length === 5 && parseInt(zip).toString() === zip.toString()) {
      const data = {
        userInputZip: '',
        zip: zip,
        page: 0,
        loading: true,
        events: [],
        userWantsToChangeZip: false
      }
      this.setState(data, this.componentWillSearchOpportunities)
    }
    else {
      Actions.modal({
        header: 'Error',
        message: 'Zip has been entered incorrectly'
      })
    }
  }

  componentWillDetermineSearch() {
    const fail = e => this.setState({
      userWantsToChangeZip: false
    })
    if(!this.state.userInputZip) {
      fail()
    }
    else if(!(this.state.userInputZip.length == 5)) {
      fail()
    }
    else {
      this.componentWillChangeZip(this.state.userInputZip)
    }
  }

  retryWithNoInternet() {
    this.setState({
      loading: true,
      noInternet: false
    }, () => {
      this.initializeSearch()
    })
  }

  render() {
    return(
      <Base>
        {
                    this.state.loading || this.state.noInternet ?
                        <View>
                          {
                            this.state.noInternet ? 
                              <Button 
                                text="reconnect" 
                                onPress={ () => { this.retryWithNoInternet() } } 
                              /> 
                              : 
                              <Loader/>
                          }
                        </View>
                        :
                        <View>
                            {
                                !this.state.userWantsToChangeZip ?
                                    <Button text={'change zip code ' + this.state.zip} onPress={ e => { this.setState({userWantsToChangeZip:true}) }} />
                                    :
                                    <View>
                                        <Container>
                                            <ColSix>
                                                <TextInput
                                                    style={style.TextInput}
                                                    underlineColorAndroid='transparent'
                                                    onChangeText={ zip => { this.setState({userInputZip:zip}) } }
                                                    value={this.state.userInputZip}
                                                    placeholderTextColor={darkGreen}
                                                    onBlur={ e => { this.componentWillDetermineSearch() }}
                                                    placeholder="zip code"
                                                    autoCapitalize="none"
                                                    ref="zipInput"
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    autoFocus={true}
                                                    keyboardType="numeric"
                                                    maxLength={5}
                                                    onSubmitEditing={ e => { this.componentWillChangeZip(this.state.userInputZip) } }
                                                    returnKeyType="go"
                                                />
                                            </ColSix>
                                            <ColSix>
                                                <Button raised primary text="next" onPress={ e => { this.componentWillChangeZip(this.state.userInputZip) }} />
                                            </ColSix>
                                        </Container>
                                    </View>
                            }
                            <EventListComp list={this.state.events} />
                            {this.state.loadingNextPage ? <Loader/> : <View/>}
                            {!this.state.loadingNextPage && this.state.morePages ? <Button raised primary text="MORE" onPress={ e => { this.componentWillLoadNextPage() }} /> : <View/>}
                        </View>
                }
        </Base>
    )
  }
}

export default Items
