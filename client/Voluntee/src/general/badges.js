import {Actions} from 'react-native-router-flux'
import * as firebase from 'firebase'
import * as _ from 'lodash'
import {firebaseConfig} from '../keys/keys'
import {ObjToArr, fixArrWithKey, orderArrBy, descDateFixArr, fixArrBySize, takeOutProps, error} from './internal'
import {getDatabaseCategoryCountByRefAndTypeAndUserEmail} from './firebase'

const shouldUserHaveBadge = async props => {
  // @props
  // badge
  // userEmail
  // @
  return new Promise( async (resolve, reject) => {
    let status = false
    switch(props.badge.type) {

      case 'savedEventsCount':
        const data = { ref: 'savedEvents', type: 'userEmail', email: props.userEmail }
        const response = await getDatabaseCategoryCountByRefAndTypeAndUserEmail(data)
        status = parseInt(response) >= parseInt(props.badge.metric)
        break;

      default:
        break;
    }
    resolve(status)
  })
}

const checkBadges = async props => {
  // @props
  // userEmail
  // @
  // this will return badges that
  // need to be awarded to 
  // the user
  return new Promise( async (resolve, reject) => {
    try {
      const allBadgesWait    = getAllBadges()
      const userBadgesWait   = getBadgesByUserEmail({ userEmail: props.userEmail })
      const allBadges        = await allBadgesWait
      const userBadges       = await userBadgesWait
      // take out the badges
      // the user has already 
      // earned
      let badges = allBadges
      let giveUserBadges = []
      if(!(badges.length > 0)) {
        resolve([])
      }
      else {
        badges.forEach( async (badge, index) => {
          const badgeStatus = shouldUserHaveBadge({ badge:badge, userEmail:props.userEmail })
          badgeStatus.then( status => {
            if(status) {
              giveUserBadges.push(badge)
            }
            if(index === (badges.length - 1)) {
              resolve(giveUserBadges)
            }
          })
        })
      }
    }
    catch(err) {
      reject( error({function:'checkBadges', file:'badges.js', error:err}) )
    }
  })
}
export {checkBadges}

const getBadgesByUserEmail = async props => {
  // @props
  // userEmail
  // @
  // return badges the 
  // user has obtained
  return new Promise( async (resolve, reject) => {
    try {
      const badges = firebase.database().ref('badgesAwarded').orderByChild('userEmail').equalTo(props.userEmail)
      badges.once('value', async snap => {
        const data = snap.val()
        if(!data) {
          resolve({ earnedBadges: [], notEarnedBadges: await getAllBadges() })
        }
        else {
          let items
          items = ObjToArr({obj:data})
          items = fixArrWithKey({arr:items, name:'awardedBadgeKey'})

          resolve({ earnedBadges: items, notEarnedBadges: await getAllBadges() })
        }
      })
    }
    catch(err) {
      reject( error({function:'getBadges', file:'badges.js', error:err}) )
    }
  })
}
export {getBadgesByUserEmail}

// this func is
// not done
// return the keys
// of the badges
/// the user has obtained
const getAllBadges = async props => {
  return new Promise( async (resolve, reject) => {
    try {
      const badges = firebase.database().ref('badges')
      badges.once('value', snap => {
        const data = snap.val()
        if(!data) {
          resolve([])
        }
        else {
          let items
          items = ObjToArr({obj:data})
          items = fixArrWithKey({arr:items, name:'badgeKey'})
          items = orderArrBy({arr:items, key:'order'})
          resolve(items)
        }
      })
    }
    catch(err) {
      reject( error({function:'getAllBadges', file:'badges.js', error:err}) )
    }
  })
}

const createBadge = async props => {
  // @props
  // title
  // message
  // image
  // order
  // type
  // metric
  // @
  return new Promise( async (resolve, reject) => {

    try {

      const key = firebase.database().ref().child('badges').push().key
      const updates = {}
      updates['/badges/' + key] = props
      const row = firebase.database().ref().update(updates)
      resolve(row)

    }

    catch(err) {
      reject( error({function:'createBadge', file:'badges.js', error:err}) )
    }
  })
}
export {createBadge}













