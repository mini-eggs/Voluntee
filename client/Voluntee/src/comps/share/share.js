import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {getShareWallPostsByDescDateAndCount} from '../../general/firebase'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import {noInternetConnection} from '../../general/userActions'
import Base from '../base/base'
import ListComp from './list'

const defaultStartingState = {
  posts:[],
  descDate:null,
  count:10,
  loading:false,
  more: true
}

class Share extends React.Component {

	constructor(props) {
		super(props)
		Actions.reloadShareComponent = props => { this.componentWillReload() }
		this.state = defaultStartingState
	}

	componentDidMount() {
		this.componentWillGetPosts()
	}

	async componentWillGetPosts() {
    try {
      const data = { descDate:this.state.descDate, count:this.state.count }
      const postsObj = await getShareWallPostsByDescDateAndCount(data)
      const newPostState = [...this.state.posts, ...postsObj.items]
      const newState = {posts:newPostState,descDate:postsObj.descDate, loading:false, more:postsObj.more}
      this.setState(newState)
    }
    catch(err) {
      if(__DEV__) {
        console.log(err)
      }
      noInternetConnection()
    }
	}

	componentWillReload() {
		this.setState({posts:[],descDate:null}, this.componentWillGetPosts)
	}

	componentWillLoadNextPage() {
		this.setState({loading:true}, this.componentWillGetPosts)
	}

  componentWillReceiveProps() {
    this.setState(defaultStartingState, this.componentWillGetPosts)
  }

  render() {
   	return (
   		<Base>
   			{
   				this.state.posts.length > 0 ?
		  			<View>
			  			<ListComp list={this.state.posts} />
			  			{this.state.loading ? <Loader/> : <View/>}
			  			{!this.state.loading && this.state.more ? <Button text="more" onPress={e=>{this.componentWillLoadNextPage()}} /> : <View/>}
		  			</View>
		  			:
		  			<Loader/>
   			}
   		</Base>
   	)
  }
}

export default Share






