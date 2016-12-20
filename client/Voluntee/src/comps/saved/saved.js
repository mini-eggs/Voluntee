import React from 'react'
import {Text,ActivityIndicator,View,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import {displayListOnMap} from '../map/general'
import Base from '../base/base'
import {getSavedEventsByUserEmail} from '../../general/firebase'
import {noInternetConnection} from '../../general/userActions'
import EventListComp from '../items/list'

const defaultStartingState = {
    loading:true,
    loadingNextPage:false,
    morePages:false,
    events:[],
    page:0,
    count:10,
    descDate:null
}

class SavedEvents extends React.Component {

    constructor(props) {
        super(props)
        // register left map button
        // to use this component
        Actions.ViewEventsOnMap = () => { 
            // view all current events
            // in map component
            if(__DEV__) console.log('Actions.ViewEventsOnMap - saved.js')
            displayListOnMap({events: this.state.events})
        }
        this.state = defaultStartingState
    }

    getEventFromList(list) {
        // return the event for
        // the list comp
        return list.map(item => {
            // tell the event component
            // this event has already been saved
            item.event.alreadySaved = true
            item.event.firebaseSavedKey = item.key
            return item.event
        })
    }

    async loadSavedEvents() {
        // get saved events by
        // user email
        // count
        // and descDate (can be null)
        try {
            const eventsData = await getSavedEventsByUserEmail({
                userEmail: Actions.user.email,
                count: this.state.count,
                descDate: this.state.descDate
            })
            this.setState({
                descDate:eventsData.items[eventsData.items.length - 1].descDate, 
                events:this.state.events.concat(this.getEventFromList(eventsData.items)),
                loading:false,
                morePages:eventsData.more,
                loadingNextPage:false
            })
        }
        catch(err) {
            if(__DEV__) {
              console.log(err.status)
            }
            
            this.setState({loading:false, morePages:false, loadingNextPage:false})

            if(typeof err.status !== 'undefined') {

                if(err.status === 0) {
                  Actions.modal({
                    header: 'Woah!',
                    message: err.msg,
                    onComplete: () => {}
                  })
                }

                else {
                  noInternetConnection()
                }
            } 

            else {
              noInternetConnection()
            }
        }
    }

    async componentDidMount() {
        // check if user is signed in
        // redirect to account page if not
        if(!Actions.user){
            Actions.changeModal({
                header:'No user',
                message:'Please sign in to continue',
                onComplete: event => Actions.Account()
            })
            Actions.showModal()
        } else {
            // begin loading saved events
            // via the user's email
            this.loadSavedEvents()
        }
    }

    // this will be hit when user returns to this comp
    // from removing it
    componentWillReceiveProps(props) {
        this.setState(defaultStartingState, this.loadSavedEvents)
    }

    // increment state page
    // load new data
    componentWillLoadNextPage() {
        this.setState({page: this.state.page + 1, loadingNextPage:true}, this.loadSavedEvents)
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
                            <EventListComp list={this.state.events} />
                            {
                            	this.state.loadingNextPage ? 
	                            	<Loader/> 
	                            	: 
	                            	<View/>
                            }
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

export default SavedEvents