import React from 'react'
import {Text} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import Base from '../base/base'
import {createBadge, updateBadgeByTitle, getBadgesByUserEmail} from '../../general/badges'
import {checkBadgesAction} from '../../general/userActions'

const initialState = {
  loading: true,
  earnedBadges: [],
  notEarnedBadges: []
}

class Badges extends React.Component {

	constructor(props) {
		super(props)
		this.state = initialState
	}

	async componentDidMount() {
    if(Actions.user) {
      this.getBadges()
    }
    else {
      Actions.modal({
        header: 'No user',
        message: 'Please sign in to continue',
        onComplete: event => Actions.Account()
      })
    }
	}

  async getBadges() {
    try {
      const response = getBadgesByUserEmail({ userEmail: Actions.user.email })
      console.log( await response )
    }
    catch(err) {
      console.log(err)
    }
  }

  async createBadge() {
    const num = 15
    const badgeCreateData = {
      title: `savedEventsCount - ${num}`,
      message: `This is a test badge for saving ${num} events`,
      image: 'https://i.imgur.com/220k4ZF.png',
      order: 3,
      type: 'savedEventsCount',
      metric: num
    }
    return await createBadge(badgeCreateData)
  }

  async checkBadges() {
    checkBadgesAction({ userEmail: Actions.user.email })
  }

  render() {
    return (
    	<Base>
        <Loader />
        {/*<Button 
          text="create badge"
          onPress={ e => this.createBadge() }
        />*/}
        <Button 
          text="check badges"
          onPress={ e => this.checkBadges() }
        />
    	</Base>
    )
  }
}

export default Badges