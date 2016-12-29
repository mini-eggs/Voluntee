import React from 'react'
import {Actions} from 'react-native-router-flux'

import {notLoggedIn} from '../../general/userActions'
import Base from '../base/base'
import CreateForm from './form'

class CreateShare extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {
		if(!Actions.user){
      notLoggedIn()
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