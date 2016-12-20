// allow app to read basic firebase info
// anywhere via flux actions
// see init functino
import {Actions} from 'react-native-router-flux'
// requiring main lib
import * as firebase from 'firebase'
// get lodash for easy arr/obj processes
import * as _ from 'lodash'
// we need our creds, bro!
// don't commit these
// see gitignore
import {firebaseConfig} from '../keys/keys'

// here's some docs
// becuase we're new to firebase
// https://firebase.google.com/docs/database/web/read-and-write

// iterate through an obj
// via keys and turn it into an arr
// because firebase is still an infant
const ObjToArr = props => Object.entries(props.obj)

// put the key as a prop
// within the second object
// because firebase is janky
// and likes to use keys as the
// object name
const fixArrWithKey = props => props.arr.map(arr => {
  let newArr = arr[1]
  if(props.name) {
    newArr[props.name] = arr[0]
  }
  else {
    newArr.commentKey = arr[0]
  }
  return newArr
})

// pass in a key
// and return all values
// for that key
const orderArrBy = props => _.sortBy(props.arr, props.key)

// interal
const descDateFixArr = props => {
  if(!props.descDate) {
    return props.arr
  }
  else {
    let data = []
    props.arr.forEach(item => {
      if(item.descDate > props.descDate) {
        data.push(item)
      }
    })
    return data
  }
}

// interal
const fixArrBySize = props => {
  return props.arr.slice(0, props.size)
}

// internal
const takeOutProps = props => {
  let data = []
  props.arr.forEach(item => {
    if(!props.remove.includes(item[props.prop])) {
      data.push(item)
    }
  })
  return data
}

const getMessageThreadFromKey = async props => {
  // @props
  // key
  // @
  return new Promise( async (resolve, reject) => {
    const messages = firebase.database().ref('messages').orderByChild('messagesParent').equalTo(props.key)
    messages.once('value', snap => {
      let data = snap.val()
      if(!data) {
        reject(`No messages can be found for key of ${props.key}`)
      }
      else {
        data = ObjToArr({obj:data})
        data = fixArrWithKey({arr:data})
        data = orderArrBy({arr:data, key:'descDate'})
        data = data.reverse()
        resolve(data)
      }
    })
  })
}
export {getMessageThreadFromKey}

// internal
const getMessgeParentByUserEmailAndProp = async props => {
  // @props
  // selectedProp
  // userEmail
  //@
  return new Promise( async(resolve, reject) => {
    const msg = firebase.database().ref('messagesParent').orderByChild(props.selectedProp).equalTo(props.userEmail)
    msg.once('value', snap => {
      const data = snap.val()
      if(!data) {
        resolve([])
      }
      else {
        resolve(fixArrWithKey({arr:ObjToArr({obj:data})}))
      }
    })
  })
}

const getMessageParentForUser = async props => {
	// @props
	// userEmail
	// descDate - optional
  // size
	// @
	return new Promise( async (resolve, reject) => {
    try {

      let blockedUsers = []
      if(Actions.user) {
        blockedUsers = await getBlockedUsersByUserEmail({userEmail: Actions.user.email})
      }

      const messagesTo = await getMessgeParentByUserEmailAndProp({userEmail:props.userEmail, selectedProp:'toUserEmail'})
      const messagesFrom = await getMessgeParentByUserEmailAndProp({userEmail:props.userEmail, selectedProp:'fromUserEmail'})

      let items = [...messagesTo, ...messagesFrom]
      items = orderArrBy({arr:items, key:'descDate'})
      items = descDateFixArr({arr:items, descDate:props.descDate})
      items = takeOutProps({arr:items,prop:'fromUserEmail', remove:blockedUsers})
      items = takeOutProps({arr:items,prop:'toUserEmail', remove:blockedUsers})

      const fixedSize = fixArrBySize({arr:items, size:props.size})
      const more = fixedSize.length < items.length && fixedSize.length === props.size
      const descDate = fixedSize[fixedSize.length - 1].descDate

      resolve({items:fixedSize,morePages:more,descDate:descDate})
    }
    catch(err) {
      if(__DEV__) {
        console.log('Error in getMessageParentForUser within firebase.js Error below')
        console.log(err)
      }
      reject()
    }
	})
}
export {getMessageParentForUser}

// internal
const addThreadMessage = async props => {
  return new Promise( async (resolve, reject) => {
    try {
      const commentKey = props.commentKey
      delete props.commentKey
      const parentUpdate = {}
      parentUpdate[`/messagesParent/${commentKey}`] = props
      const parentRow = firebase.database().ref().update(parentUpdate)
      props.messagesParent = commentKey 
      const messageKey = firebase.database().ref().child('messages').push().key
      const updates = {}
      updates[`/messages/${messageKey}`] = props
      const row = firebase.database().ref().update(updates)
      resolve([parentRow, row])
    }
    catch(err) {
      if(__DEV__) {
        console.log('Error in addThreadMessage within firebase.js. Error below.')
        console.log(err)
      }
      reject(err)
    }
  })
}

// internal 
const createNewMessage = async props => {
  return new Promise( async (resolve, reject) => {
    // create a refernce point 
    const parentKey = firebase.database().ref().child('messagesParent').push().key
    const parentUpdate = {}
    parentUpdate[`/messagesParent/${parentKey}`] = props
    const parentRow = firebase.database().ref().update(parentUpdate)
    props.messagesParent = parentKey 
    // create new messsage
    const messageKey = firebase.database().ref().child('messages').push().key
    const updates = {}
    updates[`/messages/${messageKey}`] = props
    const row = firebase.database().ref().update(updates)
    resolve([parentRow, row])
  })
}

const createMessage = async props => {
  return new Promise( async (resolve, reject) => {
    let data
    try {
      if(props.commentKey) {
        data = await addThreadMessage(props)
      }
      else {
        data = await createNewMessage(props)
      }
      resolve(data)
    }
    catch(err) {
      if(__DEV__) {
        console.log('Error in createMessage within firebase.js. Error below:')
        console.log(err)
      }
      reject(err)
    }
  })
}
export {createMessage}

// interal
const checkReportedStatus = async props => {
  return new Promise(async(resolve, reject) => {
    const reportedStatus = firebase.database().ref('reportedComments').orderByChild('userEmail').equalTo(props.userEmail)
    reportedStatus.once('value', snap => {
      const data = snap.val()
      if(data) {
        ObjToArr({
          obj: data
        }).forEach(item => {
          if(item[1].userEmail === props.userEmail && item[1].key === props.key) reject()
        })
      }
      resolve()
    })
  })
}

// internal
const doReportComment = async props => {
  return new Promise(async(resolve, reject) => {
    const commentReportedKey = firebase.database().ref().child('reportedComments').push().key
    const updates = {}
    updates[`/reportedComments/${commentReportedKey}`] = props
    const row = firebase.database().ref().update(updates)
    resolve()
  })
}

const reportCommentByKey = async props => {
  // @props
  // userEmail
  // key
  // @
  return new Promise(async(resolve, reject) => {
    checkReportedStatus(props)
      .then(data => doReportComment(props))
      .then(data => resolve())
      .catch(err => reject())
  })
}
export {reportCommentByKey}

// internal
const checkHiddenStatus = async props => {
  return new Promise(async(resolve, reject) => {
    const hiddenStatus = firebase.database().ref('hiddenComments').orderByChild('userEmail').equalTo(props.userEmail)
    hiddenStatus.once('value', snap => {
      const data = snap.val()
      if(data) {
        ObjToArr({
          obj: data
        }).forEach(item => {
          if(item[1].userEmail === props.userEmail && item[1].key === props.key) reject()
        })
      }
      resolve()
    })
  })
}

// internal
const doHideComment = async props => {
  return new Promise(async(resolve, reject) => {
    const commmentHiddenKey = firebase.database().ref().child('hiddenComments').push().key
    const updates = {}
    updates[`/hiddenComments/${commmentHiddenKey}`] = props
    const row = firebase.database().ref().update(updates)
    resolve()
  })
}

const hideCommentByKeyAndUserEmail = async props => {
  // @props
  // userEmail
  // key
  // @
  return new Promise(async(resolve, reject) => {
    checkHiddenStatus(props)
      .then(data => doHideComment(props))
      .then(data => resolve())
      .catch(err => reject())
  })
}
export {hideCommentByKeyAndUserEmail}

// removeCommentByKey
// delete comment 
const removeCommentByKey = async props => {
  // @props
  // key
  // @
  return new Promise(async(resolve, reject) => {
    firebase.database().ref('comments').child(props.key).remove(err => {
      err ? reject() : resolve()
    })
  })
}
export {removeCommentByKey}

// internal
const checkBlockStatus = async props => {
  return new Promise(async(resolve, reject) => {
    const user = firebase.database().ref('blocked').orderByChild('userEmail').equalTo(props.userEmail)
    user.once('value', snap => {
      const data = snap.val()
      if(data) {
        ObjToArr({
          obj: data
        }).forEach(item => {
          if(item[1].userBlocked === props.userBlocked) reject()
        })
      }
      resolve()
    })
  })
}

// internal
const doBlockUser = async props => {
  return new Promise(async(resolve, reject) => {
    const userBlockedKey = firebase.database().ref().child('blocked').push().key
    const updates = {}
    updates[`/blocked/${userBlockedKey}`] = props
    const row = firebase.database().ref().update(updates)
    resolve()
  })
}

// internal
const getHiddenCommentsByUserEmail = async props => {
  return new Promise(async(resolve, reject) => {
    const hiddenCommentRows = firebase.database().ref('hiddenComments').orderByChild('userEmail').equalTo(props.userEmail)
    hiddenCommentRows.once('value', snap => {
      const data = snap.val()
      if(!data) resolve([])
      else {
        resolve(
          ObjToArr({
            obj: data
          }).map(row => {
            return row[1].key
          })
        )
      }
    })
  })
}

// internal
const getBlockedUsersByUserEmail = async props => {
  return new Promise(async(resolve, reject) => {
    const blockedRows = firebase.database().ref('blocked').orderByChild('userEmail').equalTo(props.userEmail)
    blockedRows.once('value', snap => {
      const data = snap.val()
      if(!data) resolve([])
      else {
        resolve(
          ObjToArr({
            obj: data
          }).map(row => {
            return row[1].userBlocked
          })
        )
      }
    })
  })
}

const blockUser = async props => {
  // @props
  // userEmail
  // userBlocked
  // @
  return new Promise(async(resolve, reject) => {
    checkBlockStatus(props)
      .then(data => doBlockUser(props))
      .then(data => resolve())
      .catch(err => reject())
  })
}
export {blockUser}

// update badge earned
const updateBadgeByTitle = async props => {
  return new Promise(async(resolve, reject) => {
    try {
      const ref = firebase.database().ref('badges').orderByChild('title').equalTo(props.title)
      ref.once('value', snap => {
        snap = snap.val()
        if(!snap) reject(`no items found for badge of title ${props.title}`)
        snap = ObjToArr({
          obj: snap
        })

        // our title should be unique
        // so just grab the first tiem
        snap = snap[0]
          // snag the key
          // which is first item in the snap array
        const key = snap[0]

        // create update object
        // push props into it
        const updates = {}
        updates['/badges/' + key] = props
          // push new data into firebase
        const row = firebase.database().ref().update(updates)
      })
    }
    catch(err) {
      if(__DEV__) {
        console.log('There has been an error in the updateBadgeByName function withing firebase.js')
        console.log('Error below:')
        console.log(err)
      }
      reject(err)
    }
    resolve()
  })
}
export {updateBadgeByTitle}

// create badge
// internal function
// this will not be used by production app
// this will end up being incorporated by
// eventual node backend
const createBadge = async props => {
  // @props
  // title
  // message
  // image ( this will be a URL using HTTPS )
  // @
  // using promises to be consumed
  // by async/await
  return new Promise(async(resolve, reject) => {
    try {
      // create firebase key
      const key = firebase.database().ref().child('badges').push().key
        // create update object
        // containing new data
      const updates = {}
      updates['/badges/' + key] = props
        // push new data into firebase
      const row = firebase.database().ref().update(updates)
    }
    catch(err) {
      if(__DEV__) {
        console.log('There has been an error in the createBadge function withing firebase.js')
        console.log('Error below:')
        console.log(err)
      }
      reject(err)
    }
    // complete
    resolve()
  })
}
export {createBadge}

// read events saved in firebase
// via user email
// sort by date desc of event save date ( save date or event start date or event end date)
// check if there is another page and return if so
async function getSavedEventsByUserEmail(props) {
  // @props
  // userEmail
  // count
  // descDate
  // @
  return new Promise(async(resolve, reject) => {
    try {
      // get savedEvents ref
      // by the user's email
      let saved = firebase.database().ref('savedEvents').orderByChild('userEmail').equalTo(props.userEmail)
        // hit the firebase database
      saved.once('value', snap => {
        // snap val will not always be defined
        // example: if no entries have been made
        if(!snap.val()) reject({
            status: 0,
            msg: `No events have been saved under ${props.userEmail}`
          })
          // continue on down the chain
          // if the user has items
          // that are valid
        else {
          let items = snap.val()
            // fix the firebase obj
          items = ObjToArr({
              obj: items
            })
            // reverse the arr becuase
            // firebase is an infant
          items = items.reverse()
            // only get the data we care about
            // the key is stored in the first element
            // in the arr we just received
          items = items.map(item => {
            item[1].key = item[0]
            return item[1]
          })
          items = orderArrBy({
              arr: items,
              key: 'descDate'
            })
            // init a new array
            // for sorting reasons
          let sortedItems = []
            // iterate list and check if 
            // desc date is above props
            // if props is set
          if(props.descDate) {
            items.forEach(item => {
              if(item.descDate > props.descDate) sortedItems.push(item)
            })
          }
          // we're taking the first page of saved events
          else {
            sortedItems = items
          }
          // get the first ${props.count} of arr
          // add one to account for more pages available
          sortedItems = _.take(sortedItems, props.count + 1)
            // remove the last item
            // create new arr to compare length
            // for pagination
          const returnItems = _.take(sortedItems, props.count)
            // check if there are more pages
          const moreItems = returnItems.length >= props.count && returnItems.length < sortedItems.length
            // complete
          resolve({
            more: moreItems,
            items: returnItems
          })
        }
      })
    }
    catch(err) {
      if(__DEV__) {
        console.log('There has been an error in getSavedEventsByUserEmail within firebase.js')
        console.log('Error below:')
        console.log(err)
      }
      reject(err)
    }
  })
}
export {getSavedEventsByUserEmail}

// checking if event has already
// been saved in firebase via
// event id and user email
async function checkIfEventHasBeenSavedByUserEmailAndEventId(props) {
  // return promise to make async/await friendly
  // think about making the promise async
  return new Promise((resolve, reject) => {
    // get list of saved events
    // via firebase that have the user email tied to it
    firebase.database().ref('savedEvents').orderByChild('userEmail').equalTo(props.userEmail).once('value', snap => {
      // check if there's data
      if(snap.val()) {
        // iterate through list
        // because firebase is still an infant
        // check if user has saved the event
        // by checking id
        let list = []
        ObjToArr({
            obj: snap.val()
          }).forEach(item => {
            if(item[1].eventId === props.eventId) list.push(item)
          })
          // the user has already saved the event
        if(list.length > 0) reject()
          // the user has not saved the event
        else resolve()
      } else {
        // the user has not saved the event
        // in fact the user has not saved
        // any event
        resolve()
      }
    })
  })
}

async function removeEventFromSavedByKey(props) {
  // @props
  // key
  // @
  if(__DEV__) console.log(props)
  return new Promise((resolve, reject) => {
    // remove the data by ref
    firebase.database().ref('savedEvents').child(props.key).remove(err => {
      // an error has been encountered
      // check the key that has been passed
      if(err) reject(err)
        // remove has been successful
      else resolve()
    })
  })
}
export {removeEventFromSavedByKey}

// save events to user prfiles
// via firebase
async function saveEvent(props) {
  // @props
  // userEmail
  // event ID 
  // event (this will be an entire event data object received from volunteer match)
  // @
  // think about wrapping this functino in a promise
  // but use async before reject/resolve to make it
  // async/await friendly
  try {
    if(__DEV__) console.log(`beginning to save event ${props.eventId}`)
      // check if this user can save the event
      // something to note: this will only work if there are
      // already saved events within the firebase databse
    await checkIfEventHasBeenSavedByUserEmailAndEventId({
        userEmail: props.userEmail,
        eventId: props.eventId
      })
      // create firebase key in `savedEvents`
    const savedEvent = firebase.database().ref().child('savedEvents').push().key
      // create object to update the key with
    const updates = {}
    updates['/savedEvents/' + savedEvent] = props
    if(__DEV__) console.log(updates)
      // push the row
    const row = firebase.database().ref().update(updates)
      // complete
    if(__DEV__) console.log('Event has been saved successfully')
    return new Promise.resolve()
  }
  catch(err) {
    if(__DEV__) {
      console.log('There has been an error in saveEvent within firebase.js')
      console.log('or maybe the user has already saved this event. Error below:')
      console.log(err)
    }
    // some error happened
    // this is most likely something caught in 
    // checkIfEventHasBeenSavedByUserEmailAndEventId
    // which means the use has already saved the event
    // we should specify this in more detail
    // more detailed errors would be beneficial in the future
    return new Promise.reject(err)
  }
}
export {saveEvent}

// get all comments with a specific key
// from firebase
const getCommentsFromKey = async props => {

  return new Promise(async(resolve, reject) => {

    // check if the user has blocked any of these comments
    let blockedUsers = []
    if(Actions.user) {
      blockedUsers = await getBlockedUsersByUserEmail({
        userEmail: Actions.user.email
      })
    }

    // check if the user is signed in and if they have hidden any comments
    let hiddenComments = []
    if(Actions.user) {
      hiddenComments = await getHiddenCommentsByUserEmail({
        userEmail: Actions.user.email
      })
    }

    firebase.database().ref('comments').orderByChild('key').equalTo(props.key).once("value", snap => {
      // there is no data with that key
      // return an empty list
      if(!snap.val()) {
        resolve([])
        return
      }
      // there are comments with that key
      // firebase is janky, fix the data
      let comments = fixArrWithKey({
        arr: ObjToArr({
          obj: snap.val()
        })
      }).reverse()
      let commentsFixed = []
      comments.forEach(comment => {
        if(!blockedUsers.includes(comment.userEmail) && !hiddenComments.includes(comment.commentKey)) {
          commentsFixed.push(comment)
        }
      })
      resolve(commentsFixed)
    })
  })
}
export {getCommentsFromKey}

const getShareWallPostsByDescDateAndCount = async props => {
  return new Promise(async(resolve, reject) => {
    try {
      let blockedUsers = []
      if(Actions.user) {
        blockedUsers = await getBlockedUsersByUserEmail({userEmail: Actions.user.email})
      }
      const posts = firebase.database().ref('posts')
      posts.once('value', snap => {
        let items = snap.val()
        if(!items) {
          resolve({more:false, items:[]})
        }
        else {
          items = ObjToArr({obj:items})
          items = fixArrWithKey({arr:items, name:'postKey'})
          items = orderArrBy({arr:items, key:'descDate'})
          items = descDateFixArr({arr:items, descDate:props.descDate})
          items = takeOutProps({arr:items,prop:'userEmail', remove:blockedUsers})
          const fixedSize = fixArrBySize({arr:items, size:props.count})
          const more = fixedSize.length < items.length && fixedSize.length === props.count
          const descDate = fixedSize[fixedSize.length - 1].descDate
          resolve({more:more,items:fixedSize,descDate:descDate})
        }
      })
    }
    catch(err) {
      if(__DEV__) {
        console.log(err)
      }
      reject()
    }
  })
}
export {getShareWallPostsByDescDateAndCount}

const initializeFirebase = props => {
  Actions.firebase = firebase.initializeApp(firebaseConfig)
    // calling the database like
    // this will make future calls 
    // faster
  firebase.database()
}
export {initializeFirebase}

// count how much data is in firebase
// with a user email
// in a specific ref
// const getDatabaseCategoryCountByRefAndTypeAndUserEmail = props => new Promise((resolve,reject) => {
async function getDatabaseCategoryCountByRefAndTypeAndUserEmail(props) {
  // @props
  // ref -string
  // type - string
  // email - user's email
  // @
  return new Promise((resolve, reject) => {
    // get database ref
    const ref = firebase.database().ref(props.ref).orderByChild(props.type).equalTo(props.email)
    try {
      ref.once('value', snap => {
        const val = snap.val()
        if(val)
          resolve(Object.keys(val).length)
        else
          resolve(0)
      })
    }
    catch(err) {
      if(__DEV__) {
        console.log('Something went wrong in getDatabaseCategoryCountByRefAndTypeAndUserEmail')
        console.log('We don\'t necessary need to show the error to the user. Error below:')
        console.log(err)
      }
      // some error happened
      // not sure if we care
      return resolve(0)
    }
  })
}
export {getDatabaseCategoryCountByRefAndTypeAndUserEmail}

// create commment with props
// we don't know anything about
// the props nor do we care
const createComment = props => new Promise((resolve, reject) => {
  // create key 
  let comment = firebase.database().ref().child('comments').push().key
    // create update object and push data into it
  let updates = {}
    // speficy what ref this is being added to
  updates['/comments/' + comment] = props
    //push the row
  let row = firebase.database().ref().update(updates)
    // return row data
    // which won't actually be used
    // as firebase return null when pushing updates
    // but is useful for knowing when this process is complete
  resolve(row)
})
export {createComment}

const createSharePost = props => new Promise((resolve, reject) => {
  let post = firebase.database().ref().child('posts').push().key
  let updates = {}
  updates['/posts/' + post] = props
  let row = firebase.database().ref().update(updates)
  resolve(row)
})
export {createSharePost}

const register = async props => {
	return new Promise( async (resolve, reject) => {

  	const createUser = firebase.auth().createUserWithEmailAndPassword(props.email, props.password)

	  createUser.then(user => {
	   	user.updateProfile({displayName: props.username}).then(something => {
	     	user.updateProfile({photoURL: props.image}).then(something => resolve(user))
	    })
	  })

	  createUser.catch(err => reject(err))

	})
}
export {register}

const login = props => new Promise((resolve, reject) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(props.email, props.password)
    .then(user => resolve(user))
    .catch(err => reject(err))
})
export {login}

const logout = props => new Promise((resolve, reject) => {
  firebase
    .auth()
    .signOut()
    .then(something => resolve(something))
    .catch(something => resolve(something))
})
export {logout}

const addItemToProfile = (userCreds, props) => new Promise((resolve, reject) => {
  if(!userCreds)
    reject('User is null')
  login({
      email: userCreds.email,
      password: userCreds.password
    })
    .then(user => {
      user
        .updateProfile(props)
        .then(something => resolve(user))
        .catch(err => reject(err))
    })
    .catch(err => reject(err))
})
export {addItemToProfile}












