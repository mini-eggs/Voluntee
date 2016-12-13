import React from 'react'
import {Text,View,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Container,ColSix,Spacer,ColTwelve} from '../bootstrap/bootstrap'
import NoTabBase from '../base/noTabber'
import Base from '../base/base'
import CreateForm from './form'

class CreateShare extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			to: props.to
		}
	}

	async componentDidMount() {  

		// check if we have a
		// user logged in
		// pop component if not
		Actions.user ? 'valid' : Actions.modal({
			header:'No user',
			message:'Please sign in to continue',
			onComplete: event => Actions.pop()
		})
	}

  	render() {
    	return (
    		<Base>
    			<CreateForm to={this.state.to} parent={this}/>
    		</Base>
    	)
  	}
}

export default CreateShare