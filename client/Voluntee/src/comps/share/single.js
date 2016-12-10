import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Avatar,ListItem} from 'react-native-material-ui'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {getShareWallPostsByDescDateAndCount} from '../../general/firebase'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {lightGreen,screenHeight,tabBarHeight,actionBarHeight,screenArea,getPhoto,facebookBlue} from '../../general/general'
import Base from '../base/base'
import {style} from './style'
import CommentComp from '../comment/comment'

const circle = 50
const ratio = 0.6
const borderSize = 2
const UserDescCompStyle = {
    Spacer:{
        height:4
    },
    Container:{
        backgroundColor:lightGreen,
        margin:10,
        padding:10,
        borderRadius:3
    },
    Image:{
        height:circle * ratio - borderSize * 2,
        width:circle * ratio - borderSize * 2,
        marginLeft: ( (circle/2) * (1 - ratio) )
    },
    Cirlce:{
        backgroundColor:lightGreen,
        width:circle,
        height:circle,
        borderRadius:circle/2,
        flex:1,
        alignItem:'center',
        justifyContent:'center',
        borderWidth:borderSize,
        borderColor:'#fff'
    },
    UserImage:{
        resizeMode:'cover',
        width:circle,
        height:circle,
        borderRadius:circle/2,
        borderWidth:borderSize,
        borderColor:'#fff'
    },
    ActivityIndicator:{
    },
    Text:{
        fontSize:16,
        color:'#fff',
        fontWeight:'600'
    }
}

const inline = {
    Background:{
        backgroundColor:'#fff',
        minHeight:screenArea
    },
    userImage:{
        flexDirection:'row',
        alignItem:'center',
        justifyContent:'center',
        marginTop:15, 
        marginBottom:15
    },
    Border:{
        borderColor:"#fff"
    },
    TextInput:{
        height:40,
        fontSize:18,
        borderColor:lightGreen,
        borderRadius:3,
        margin:0,
        padding:10,
        borderWidth:3
    },
    Divider:{
        height:10
    }
}

class ShareSingle extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			item:props.post
		}
	}
  	render() {
    	return (
    		<Base>
                <View style={inline.Background}>
                    <View style={UserDescCompStyle.Container}>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            <View style={{flex:0.25}}>
                                <Image style={UserDescCompStyle.UserImage} source={{uri:this.state.item.userPhoto}} />
                            </View>
                            <View style={{flex:0.75}}>
                                <View style={UserDescCompStyle.Spacer} />
                                <Text numberOfLines={1} style={UserDescCompStyle.Text}>{this.state.item.userDisplayName}</Text>
                                <Text numberOfLines={1} style={UserDescCompStyle.Text}>{this.state.item.userEmail}</Text>
                            </View>
                        </View>
                        <View style={inline.Divider} />
                        <View>
                            <Text style={style.TextTitle}>
                                {this.state.item.title}
                            </Text>
                            <Text style={style.Text}>
                                {this.state.item.description}
                            </Text>
                        </View>
                    </View>
                    <View style={{margin:10, marginTop:0}}>
                        <CommentComp data={{ref:'posts', key:this.state.item.key}} />
                    </View>
                </View>
    		</Base>
    	)
  	}
}

export default ShareSingle