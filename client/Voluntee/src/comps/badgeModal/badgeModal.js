import React from 'react'
import {View,Modal,Text,TouchableHighlight,Dimensions,Image} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import {screenHeight, statusbarHeight} from '../../general/general'

const initialState = {
  modalVisible:false,
  badges: []
}

const style = {
  container:{
    flex:1,
    justifyContent:'flex-start',
    width:Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  Image: {
    height: 150,
    margin: 50,
    marginLeft: 0,
    marginRight: 0
  },
  TextHeader:{
    fontSize: 16,
    textAlign: 'left',
    fontWeight:'600',
    marginBottom:7.5
  },
  Text:{
    fontSize: 20,
    textAlign: 'left',
    fontWeight:'600'
  },
  inner:{
    padding:15,
    backgroundColor:'#fff',
    minHeight: screenHeight - statusbarHeight,
    marginTop: statusbarHeight
  }
}

const BadgeComp = props => {
  return (
    <View style={style.container}>
      <View style={style.inner}>
        <Text style={style.TextHeader}>{props.badge.title}</Text>
        <Image 
          resizeMode="contain"
          style={style.Image} 
          source={{ uri: props.badge.image }} 
        />
        <Text style={style.Text}>{props.badge.message}</Text>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button 
            radius={true} 
            text="DISMISS" 
            onPress={ e => { props.onPress() } } 
          />
        </View>
      </View>
    </View>
  )
}

class badgeModal extends React.Component{

  constructor(props){
    super(props)
    this.registerEvents()
    this.state = initialState
  }

  componentDidUpdate() {
    this.registerEvents()
  }

  registerEvents() {
    Actions.badgeModal = props => this.setState({ badges: props.badges })
  }

  userClose() {
    // remove first badge
    // and wait before
    // showing the next badge
    const badges = this.state.badges
    badges.shift()
    this.setState({ badges:[] }, () => {
      setTimeout( () => {
        this.setState({ badges: badges })
      }, 500)
    })
  }

  render(){
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.badges.length > 0}
        onRequestClose={ () => {} }
      >
       {
         this.state.badges.length > 0 ?
           <BadgeComp
             badge={this.state.badges[0]}
             onPress={ e => { this.userClose() } }
           />
           :
           <View/>
       }
      </Modal>
    )
  }
}

export default badgeModal
