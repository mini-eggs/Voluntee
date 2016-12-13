import React from 'react'
import {Text,ActivityIndicator,View,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import Base from '../base/base'
// import {} from '../../general/firebase'
import {darkGreen} from '../../general/general'

class MessageComp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading:true,
            loadingNextPage:false,
            morePages:true,
            page:0,
            events:[]
        }
    }

    async componentDidMount() {

    }

    componentWillGetMessages() {

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
        this.setState({page:(this.state.page + 1),loadingNextPage:true}, this.componentWillSearchOpportunities)
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
                            {this.state.loadingNextPage ? <Loader/> : <View/>}
                            {!this.state.loadingNextPage && this.state.morePages ? <Button raised primary text="MORE" onPress={ e => { this.componentWillLoadNextPage() }} /> : <View/>}
                        </View>
                }
    		</Base>
    	)
  	}
}

export default MessageComp