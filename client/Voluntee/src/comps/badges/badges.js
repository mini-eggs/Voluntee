import React from 'react'
import {Text,View} from 'react-native'
import {Actions} from 'react-native-router-flux'
import * as _ from 'lodash'

import {Button} from '../button/button'
import {Loader} from '../loader/loader'
import Base from '../base/base'
import {createBadge, updateBadgeByTitle, getBadgesByUserEmail} from '../../general/badges'
import {checkBadgesAction, notLoggedIn} from '../../general/userActions'
import BadgeList from './list'

const initialState = {
  loading: true,
  earnedBadges: [],
  nonEarnedBadges: []
}

class Badges extends React.Component {

	constructor(props) {
		super(props)
		this.state = initialState
	}

	componentDidMount() {
    Actions.user ? this.getBadges() : notLoggedIn()
	}

  async getBadges() {
    try {
      const badges = await this.getBadgesMediator()
      this.setState({ earnedBadges: badges.earnedBadges, nonEarnedBadges: badges.nonEarnedBadges, loading:false })
      if( !(badges.earnedBadges > 0) ) {
        Actions.modal({
          header: 'Woah!',
          message: 'You have yet to earn a badge'
        })
      }
    }
    catch(err) {
      console.log(err)
    }
  }

  async getBadgesMediator() {
    return new Promise( async (resolve, reject) => {
      try {
        const response = getBadgesByUserEmail({ userEmail: Actions.user.email })
        badges = await response
        const earnedBadges = badges.earnedBadges.map( earnedBadge => _.find(badges.allBadges, { 'badgeKey': earnedBadge.badgeKey }) )
        let nonEarnedBadges = []
        const earnedKeys = badges.earnedBadges.map( badge => badge.badgeKey)
        badges.allBadges.forEach( badge => {
          if(!earnedKeys.includes(badge.badgeKey)) {
            nonEarnedBadges.push(badge)
          }
        })
        resolve({ earnedBadges: earnedBadges, nonEarnedBadges: nonEarnedBadges })
      }
      catch(err) {
        if(__DEV__) {
          console.log(err)
        }
        reject()
      }
    })
  }

  // createBadge() {
  //   const badgeCreateData = {
  //     title: `distanceCount - 500`,
  //     message: `This is a test badge for travelling 500 miles`,
  //     image: 'https://i.imgur.com/eWdlmEt.png',
  //     order: 11,
  //     type: 'distanceCount',
  //     metric: 500
  //   }
  //   createBadge(badgeCreateData)
  // }

  render() {
    return (
    	<Base>
        {
          this.state.loading ?
            <Loader/>
            :
            this.state.earnedBadges.length > 0 ?
              <BadgeList 
                earnedBadges={this.state.earnedBadges}
                nonEarnedBadges={this.state.nonEarnedBadges}
              />
              :
              <View/>
        }
    	</Base>
    )
  }
}

export default Badges