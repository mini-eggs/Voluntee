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
    Text:{
        textAlign:'center',
        fontSize:18,
        color:'#fff',
        fontWeight:'600'
    },
    TextLeft:{
        fontSize:18
    },
    TextInput:{
        // height:51.5,
        height:53,
        textAlign:'center',
        fontSize:18,
        color:'#fff',
        fontWeight:'600'
    }
}

class Items extends React.Component {

    constructor(props){
        // set up extended comp
        super(props)
        // register left map button
        // to use this component
        Actions.ViewEventsOnMap = () => { 
            // view all current events
            // in map component
            displayListOnMap({events: this.state.events})
        }
        // get initial state
        this.state = {
            loading:true,
            loadingNextPage:false,
            morePages:true,
            zip:null,
            userInputZip:null,
            page:0,
            events:[],
            userWantsToChangeZip:false
        }
    }

    async componentDidMount(){
        // get zip
        try {
            const loc = await getLocation()
            const zip = await getZipFromLatAndLong({lat:loc.coords.latitude,long:loc.coords.longitude})
            this.componentWillReceiveZip(zip.postalCodes[0].postalCode)
        }
        catch(err) {
            if(__DEV__) {
                console.log('Error in componentDidMount within items.js, error below: ')
                console.log(err)
            }

            // no geo location
            if(err.message === 'Location request timed out') {
              Actions.modal({
                header: 'Error',
                message: 'Could not find current zip. Please make sure locations are enabled.',
                onComplete: () => { this.setState({zip:'00000', loading: false, morePages:false, userWantsToChangeZip: true}) }
              })
            } 

            // default / no internet
            else {
              noInternetConnection()
            }
        }
    }

    componentWillReceiveZip(zip){
        this.setState({zip:zip},this.componentWillSearchOpportunities)
    }

    componentWillSearchOpportunities(){
        let data = {zip:this.state.zip,page:this.state.page}
        searchOpportunities(data)
            .then( events => {
                let newEventsArr = [...this.state.events, ...events]
                let morePages = (events.length >= 10)
                this.setState({events:newEventsArr,loading:false,loadingNextPage:false, morePages:morePages})
            })
            .catch( err => console.log(err))
    }

    componentWillLoadNextPage(){
      const newState = {page:(this.state.page + 1),loadingNextPage:true}
      this.setState(newState, this.componentWillSearchOpportunities)
    }

    componentWillChangeZip(zip){

        if(!zip) return

        if(zip.toString().length === 5 && parseInt(zip).toString() === zip.toString()) {
            const data = {
                userInputZip:'',
                zip:zip,
                page:0,
                loading:true,
                events:[],
                userWantsToChangeZip:false
            }
            this.setState(data, this.componentWillSearchOpportunities)
        }

        else {
            Actions.modal({
                header:'Error',
                message:'Zip has been entered incorrectly'
            })
        }
    }

    // use this to decide if we 
    // should search on input blur
    componentWillDetermineSearch() {
        // initialize fail function
        // this won't necessarily
        // display to user, bc
        // it could be invoked by a cancel
        const fail = e => this.setState({userWantsToChangeZip:false})
        // initially check if the
        // user input is defiend
        if(!this.state.userInputZip) {
            fail()
            return
        }
        // the user most likely cancelled
        // this is also invoked if the
        // user has not entered enough
        // characters
        if(!(this.state.userInputZip.length == 5)) {
            fail()
            return
        }
        // user has entered
        // adequate information
        // for zip search
        else
            this.componentWillChangeZip(this.state.userInputZip)
    }

  	render() {
    	return (
    		<Base>
                {
                    this.state.loading ?
                        <View>
                            <Loader/>
                        </View>
                        :
                        <View>
                            {
                                !this.state.userWantsToChangeZip ?
                                    <Button text={'change zip code ' + this.state.zip} onPress={ e => { this.setState({userWantsToChangeZip:true}) }} />
                                    :
                                    <View>
                                        <Container>
                                            {/*<ColThree>
                                                <Button raised primary text="cancel" onPress={ e => { this.setState({userWantsToChangeZip:false}) }} />
                                            </ColThree>*/}
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