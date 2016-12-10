import React from 'react'
import {Text} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Base from '../base/base'
import {createBadge, updateBadgeByTitle} from '../../general/firebase'

const style = {
}

class Badges extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
		}
	}

	async componentDidMount() {

		// this will not live in production app

		const badgeUpdates = await updateBadgeByTitle({
			title:'test badge',
			messsage:'updating the badge worked',
			image: 'https://i.imgur.com/y115S41b.jpg'
		})

		console.log(badgeUpdates)

		// const badge = {
		// 	title: 'test badge',
		// 	message: 'lorem ipsum goes here',
		// 	image: 'https://i.imgur.com/y115S41b.jpg'
		// }

		// await createBadge(badge)

	}

  	render() {
    	return (
    		<Base>
    			<Text>badges page</Text>
    		</Base>
    	)
  	}
}

export default Badges