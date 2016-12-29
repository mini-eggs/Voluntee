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

    let data, response, status

    switch(props.badge.type) {

      case 'savedEventsCount':
        data = { ref: 'savedEvents', type: 'userEmail', email: props.userEmail }
        response = await getDatabaseCategoryCountByRefAndTypeAndUserEmail(data)
        status = parseInt(response) >= parseInt(props.badge.metric)
        break;

      case 'commentsCount':
        data = { ref: 'comments', type:'userEmail', email: props.userEmail }
        response = await getDatabaseCategoryCountByRefAndTypeAndUserEmail(data)
        status = parseInt(response) >= parseInt(props.badge.metric)
        break;

      case 'postsCount':
        data = { ref: 'posts', type:'userEmail', email: props.userEmail }
        response = await getDatabaseCategoryCountByRefAndTypeAndUserEmail(data)
        status = parseInt(response) >= parseInt(props.badge.metric)
        break;

      default:
        status = false
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

      let badges = []

      const badgesEarnedKeys = userBadges.earnedBadges.map( badge => badge.badgeKey)
      allBadges.forEach( badge => {
        if(!badgesEarnedKeys.includes(badge.badgeKey)) {
          badges.push(badge)
        }
      })
      if(!(badges.length > 0)) {
        resolve([])
      }
      else {

        const badgePromises = Promise.all(
          badges.map( async (badge, index) =>  
            await shouldUserHaveBadge({ badge:badge, userEmail:props.userEmail })
          )
        )

        badgePromises.then(values => {
          let giveUserBadges = []
          values.forEach( (status, index) => {
            if(status) {
              giveUserBadges.push( badges[index] )
            }
          })
          resolve( orderArrBy({arr:giveUserBadges, key:'order'}) )
        })

        badgePromises.catch(err => reject(err))
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
      const allBadges = await getAllBadges()

      badges.once('value', async snap => {

        const data = snap.val()

        if(!data) {
          resolve({ earnedBadges: [], allBadges: allBadges })
        }

        else {
          let items
          items = ObjToArr({obj:data})
          items = fixArrWithKey({arr:items, name:'awardedBadgeKey'})
          resolve({ earnedBadges: items, allBadges: allBadges })
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

// internal
const checkIfUserHasBadge = async props => {
  return new Promise( async (resolve, reject) => {
    const status = firebase.database().ref('badgesAwarded').orderByChild('userEmail').equalTo(props.userEmail)
    status.once('value', snap => {
      const data = snap.val()
      if(!data) {
        resolve()
      }
      else {
        ObjToArr({obj: data}).forEach(item => {
          if(item[1].badgeKey === props.badgeKey) {
            reject()
          }
        })
        resolve()
      }
    })
  })
}


// internal
const awardBadge = async props => {
  return new Promise( async (resolve, reject) => {
    const badgeAwardedKey = firebase.database().ref().child('badgesAwarded').push().key
    const update = {}
    update[`/badgesAwarded/${badgeAwardedKey}`] = props
    const row = firebase.database().ref().update(update)
    resolve(row)
  })
}

const awardBadgeByUserEmailAndBadgeKey = async props => {
  // @props
  // userEmail
  // badgeKey
  // @
  return new Promise( async (resolve, reject) => {
    try {
      const status = await checkIfUserHasBadge(props)
      const awarded = await awardBadge(props)
      resolve(status, awarded)
    }
    catch(err) {
      if(__DEV__) {
        console.log(err)
      }
      reject(err)
    }
  })
}
export {awardBadgeByUserEmailAndBadgeKey}











