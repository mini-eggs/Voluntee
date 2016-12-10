import React from 'react'
import {Text,View,TouchableOpacity,TextInput,Image,ActivityIndicator} from 'react-native'
import {Actions} from 'react-native-router-flux'
// import {Button} from 'react-native-material-ui'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'

import {getShareWallPostsByDescDateAndCount} from '../../general/firebase'
import {Container,ColSix,Spacer,ColTwelve,ColThree} from '../bootstrap/bootstrap'
import Base from '../base/base'
import ListComp from './list'

class Share extends React.Component {
	constructor(props){
		super(props)
		Actions.reloadShareComponent = props => { this.componentWillReload() }
		this.state = {
			posts:[],
			descDate:null,
			count:10,
			loading:false,
			more: true
		}
	}
	componentDidMount(){
		this.componentWillGetPosts()
	}
	componentWillGetPosts(){
		getShareWallPostsByDescDateAndCount({descDate:this.state.descDate,count:this.state.count})
			.then( postsObj => {
				let newPosts = postsObj.items
				let moreAvailable = postsObj.more
				let descDate = newPosts[newPosts.length - 1][1].descDate
				newPosts = newPosts.map(post => post[1])
				let newPostState = [...this.state.posts, ...newPosts]
				this.setState({posts:newPostState,descDate:descDate, loading:false, more:moreAvailable})
			})
	}
	componentWillReload(){
		this.setState({posts:[],descDate:null}, this.componentWillGetPosts)
	}
	componentWillLoadNextPage(){
		this.setState({loading:true}, this.componentWillGetPosts)
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