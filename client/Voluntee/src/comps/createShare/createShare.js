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
		this.state = {}
	}

	async componentDidMount() {
		if(!Actions.user){
			Actions.modal({
				header:'No user',
				message:'Please sign in to continue',
				onComplete: event => Actions.pop()
			})
		}
	}

  	render() {
    	return (
    		<Base>
    			<CreateForm parent={this}/>
    		</Base>
    	)
  	}
}

export default CreateShare