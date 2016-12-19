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

const initialState = {
  modalVisible:false,
  message:'Hello World!',
  header:'New Modal',
  onComplete:false,
  onFail:false
}

export default class extends React.Component{

	constructor(props){
		super(props)
		// set initial state
		this.registerEvents()
		this.state = initialState
	}

	// register events to be
	// used globally
	registerEvents() {
		// register global actions
		// modal function
		Actions.changeModal = props => this.changeModal(props)
		Actions.showModal = event => this.showModal(event)
		Actions.hideModal = event => this.hideModal(event)
		Actions.modal = async props => this.abstractModel(props)
	}

	// abstract the showModal
	// and changeModal away
	// I'm writing too much code
	async abstractModel(props) {
		const status = this.changeModal(props)
		this.showModal(status)
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
	async changeModal(props) {
		return new Promise( async (resolve, reject) => {
      this.setState(initialState, () => { this.setState(props, resolve) })
		})
	}

	// call to show modal
	async showModal(event) {
		return new Promise( async (resolve, reject) => {
			this.setState({modalVisible:true}, resolve) 
		})
	}

	// call to hide modal
	hideModal(event) {
		if(this.state.onComplete) this.state.onComplete()
		this.setState({modalVisible:false})
	}

  hideModalFail(event) {
    if(this.state.onFail) this.state.onFail()
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
            {
              !this.state.onFail ?
                <Button radius={true} raised primary text="DISMISS" onPress={ e => { this.hideModal(e) }} />
                :
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:0.5}}>
                    <View style={{marginRight:7.5}}>
                      <Button radius={true} raised primary text="DISMISS" onPress={ e => { this.hideModalFail(e) }} />
                    </View>
                  </View>
                  <View style={{flex:0.5}}>
                    <View style={{marginLeft:7.5}}>
                      <Button radius={true} raised primary text="CONTINUE" onPress={ e => { this.hideModal(e) }} />
                    </View>
                  </View>
                </View>
            }
		      </View>
	      </View>
	    </Modal>
		)
	}
}