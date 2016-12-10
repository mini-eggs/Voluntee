import React from 'react'
import {View,Modal,Text,TouchableHighlight,Dimensions} from 'react-native'
import {Avatar,Card,ListItem,Toolbar} from 'react-native-material-ui'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {Container,ColSix,Spacer,ColTwelve} from '../bootstrap/bootstrap'

const style = {
	container:{
		flex:1,
		justifyContent:'center',
		width:Dimensions.get('window').width,
		backgroundColor: 'rgba(0,0,0,0.35)'
	},
	TextHeader:{
		fontSize: 14,
		textAlign: 'left',
		fontWeight:'600',
		marginBottom:7.5
	},
	Text:{
		fontSize: 18,
		textAlign: 'left',
		fontWeight:'600'
	},
	inner:{
		padding:15,
		backgroundColor:'#fff'
	}
}

export default class extends React.Component{

	constructor(props){
		super(props)
		// set initial state
		this.registerEvents()
		this.state = {
			modalVisible:false,
			message:'Hello World!',
			header:'New Modal',
			onComplete:false
		}
	}

	// register events to be
	// used globally
	registerEvents() {
		// register global actions
		// modal function
		Actions.changeModal = props => this.changeModal(props)
		Actions.showModal = event => this.showModal(event)
		Actions.hideModal = event => this.hideModal(event)
	}

	// this will be used in
	// cases where user presses
	// back and race conditions are met
	// presses back
	// fixes race time conditions
	componentDidUpdate() {
		this.registerEvents()
	}

	// change 
	// header, body, and onComplete
	// of modal globally
	changeModal(props) {
		this.setState(props)
	}

	// call to show modal
	showModal(event) { 
		this.setState({modalVisible:true}) 
	}

	// call to hide modal
	hideModal(event){
		if(this.state.onComplete) this.state.onComplete()
		this.setState({modalVisible:false})
	}

	render(){
		return (
			<Modal
	          	animationType={"fade"}
	          	transparent={true}
	          	visible={this.state.modalVisible}
	       	>
	        	<View style={style.container}>
		   			<View style={style.inner}>
		           		<Text style={style.TextHeader}>{this.state.header}</Text>
		               	<Text style={style.Text}>{this.state.message}</Text>
		              	<View style={{height:15}} />
    					<Button radius={true} raised primary text="DISMISS" onPress={ e => { this.hideModal(e) }} />
		          	</View>
	         	</View>
	        </Modal>
		)
	}
}