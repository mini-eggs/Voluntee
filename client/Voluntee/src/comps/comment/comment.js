import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Button,Avatar,ListItem} from 'react-native-material-ui'

import {getCommentsFromKey} from '../../general/firebase'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {style} from './style'
import CommentList from './list'
import CommentCreate from './create'

class CommentComp extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			ref:props.data.ref,
			key:props.data.key,
			comments:[]
		}
	}

	componentDidMount(){
		this.componentWillLoadComments()
	}

	// we dont want user to be able
	// to click on a comment
	// they just deleted or a comment
	// the just hide/reported/blocked the user of
	componentWillLoadComments(){
		const refreshState = new Promise( async (resolve, reject) => {
			this.setState({comments:[]}, resolve())
		})
		refreshState.then( () => {
			getCommentsFromKey({key:this.state.key})
				.then( data => this.setState({comments:data}))
		})
	}

	// this will be hit
	// if users are tapping 
	// very fast, reload the
	// comments so no old comments 
	// are present
    componentWillReceiveProps(props) {
    	const newState = {
			ref:props.data.ref,
			key:props.data.key,
			comments:[]
		}
        this.setState(newState, this.componentWillLoadComments)
    }

  	render() {
    	return (
    		<View>
    			<CommentCreate data={{key:this.state.key, ref:this.state.ref, parent:this}} />
    			<View style={{height:10}} />
    			<CommentList data={{comments:this.state.comments, parent:this}} />
    		</View>
    	)
  	}
}

export default CommentComp