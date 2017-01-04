import React from 'react'
import {Text} from 'react-native'
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

  // async createBadge(num, order) {
  //   const badgeCreateData = {
  //     title: `postsCount - ${num}`,
  //     message: `This is a test badge for posting ${num} sharewalls`,
  //     image: 'https://i.imgur.com/220k4ZF.png',
  //     order: order,
  //     type: 'postsCount',
  //     metric: num
  //   }
  //   return await createBadge(badgeCreateData)
  // }

  // async checkBadges() {
  //   checkBadgesAction({ userEmail: Actions.user.email })
  // }

  render() {
    return (
    	<Base>
        {
          this.state.loading ?
            <Loader/>
            :
            <BadgeList 
              earnedBadges={this.state.earnedBadges}
              nonEarnedBadges={this.state.nonEarnedBadges}
            />
        }
    	</Base>
    )
  }
}

export default Badges