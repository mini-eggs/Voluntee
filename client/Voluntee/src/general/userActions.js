import {Actions} from 'react-native-router-flux'

import {saveLoginStateToLocalStorage} from './localStorage'
import {login,register,blockUser, removeCommentByKey, hideCommentByKeyAndUserEmail, reportCommentByKey, createMessage, hideConvoByKeyAndUserEmail, reportUserByUserEmailAndProps} from './firebase'
import {checkBadges} from './badges'

// internal
const internalErrorHandling = async err => {
  return new Promise( async (resolve, reject) => {
      if(__DEV__) {
        console.log(err)
      }
      if(err.status) {
        if(err.status === 1) {
          // custom error message has
          // been handed to use
          Actions.modal({
            header: 'Error',
            message: err.msg,
            onComplete: () => { reject() }
          })
        }
        else {
          // this should be
          // expanded on later
        const genericError = await genericError()
        reject(genericError)
        }
      }
      else if(err === 1) {
        // use cancelled action
        reject()
      }
      else {
        // who knows!!!
        const genericError = await genericError()
        reject(genericError)
      }
  })
}

// internal
const internalSuccessHandling = async success => {
  return new Promise( async (resolve, reject) => {
    Actions.modal({
      header: 'Complete',
      message: success.msg,
      onComplete: () => {
        if(success.onComplete) {
          success.onComplete()
        }
        resolve()
      }
    })
  })
}

// internal
const doubleCheck = async props => {
  const message = props.message
  return new Promise( async (resolve, reject) => {
    if(!message) 
      reject('`message` props is not defined')
    else {
      Actions.modal({
        header: 'Pending',
        message: message,
        onComplete: () => { resolve(1) },
        onFail: () => { reject(1) }
      })
    }
  })
}

const checkBadgesAction = async props => {
  // @props
  // userEmail
  // @
  return new Promise ( async (resolve, reject) => {
    try {
      const checkBadgesWait = checkBadges({ userEmail: props.userEmail })
      const response = await checkBadgesWait
      Actions.badgeModal({ badges: response })
      resolve()
    }
    catch(err) {
      reject(err())
    }
  })
}
export {checkBadgesAction}

const reportUserAction = async props => {
  return new Promise( async (resolve, reject) => {
    try {

      const onComplete = props.onComplete
      const data = props
      delete data.onComplete
      const success = {
        msg: `${props.userReportedDisplayName} has been repported`,
        onComplete: () => {
          if(onComplete) {
            onComplete()
          }
          resolve()
        }
      }

      await doubleCheck({message: `Are you sure you want to report ${props.userReportedDisplayName}?`})
      await reportUserByUserEmailAndProps(data)
      await internalSuccessHandling(success)

    }
    catch(err) {
      const customError = await internalErrorHandling(err)
      reject(customError)
    }
  })
}
export {reportUserAction}

const hideConvoAction = async props => {
  return new Promise( async (resolve, reject) => {
    try {
      await doubleCheck({message:'Are you sure you want to remove this convo?'})
      // set data
      const onComplete = props.onComplete
      const data = props
      delete data.onComplete
      // hide it
      await hideConvoByKeyAndUserEmail(data)
      Actions.modal({
        header: 'Complete',
        message: 'Convo has been removed',
        onComplete:() => {
          if(onComplete) {
            onComplete()
          }
          resolve()
        }
      })
    }
    catch(err) {
      const customError = await internalErrorHandling(err)
      reject(customError)
    }
  })
}
export {hideConvoAction}

const genericError = async props => {
  return new Promise( async (resolve, reject) => {
    Actions.modal({
      header: 'Error',
      message: 'Oops, something went wrong',
      onComplete: () => { resolve() }
    })
  })
}
export {genericError}

const notLoggedIn = async props => {
  return new Promise( async (resolve, reject) => {
    Actions.modal({
      header: 'No user',
      message: 'Please sign in to continue',
      onComplete: event => Actions.Account()
    })
  })
}
export {notLoggedIn}

const noInternetConnection = async props => {
  return new Promise( async (resolve, reject) => {
    Actions.modal({
      header: 'Error',
      message: 'No internect connection can be established',
      onComplete: () => {}
    })
  })
}
export {noInternetConnection}

const createMessageAction = async props => {
	return new Promise( async (resove, reject) => {

		const onComplete = props.onComplete
		const data = props
		delete data.onComplete

		const message = createMessage(data)

		message.then(data => {
			Actions.modal({
				header: 'Complete',
				message: `Message has been sent to ${props.toUserDisplayName}`,
				onComplete: () => { onComplete() }
			})
		})

		message.catch(err => {
			Actions.modal({
				header: 'Error',
				message: 'Oops, something went wrong',
        onComplete: () => { reject() }
			})
		})
	})
}
export {createMessageAction}

const reportCommentAction = async props => {
	return new Promise( async (resolve, reject) => {
    try {
      const doubleCheckStatus = await doubleCheck({message:'Are you sure you want to report this comment?'})
      const reportCommentStatus = await reportCommentByKey(props)
      Actions.modal({
        header: 'Error',
        message: 'Comment has been reported',
        onComplete: () => { resolve() }
      })
    }
    catch(err) {
      if(__DEV__) {
        console.log(err)
      }
      if(err === 1) {
        reject()
      }
      else {
        Actions.modal({
          header:'Error',
          message:'Comment has already been reported',
          onComplete: () => { reject() }
        })
      }
    }
	})
}
export {reportCommentAction}

const hideCommentAction = async props => {
	return new Promise( async (resolve, reject) => {
    try {
      // setting data
      const onComplete = props.onComplete
      const data = props
      delete data.onComplete
      // double check
      // and do action
      const doubleCheckStatus = await doubleCheck({message:'Are you sure you want to hide this comment?'})
      const hideCommentStatus = await hideCommentByKeyAndUserEmail(data)
      Actions.modal({
        header: 'Complete',
        message: 'Comment has been hidden',
        onComplete:() => {
          if(onComplete) {
            onComplete()
          }
          resolve()
        }
      })
    }
    // this could be a cancel
    // or an actual error
    catch(err) {
      if(__DEV__) {
        console.log(err)
      }
      if(err === 1) {
        reject()
      }
      else {
        genericError().then(() => { reject() })
      }
    }
	})
}
export {hideCommentAction}

const removeCommentByKeyAction = async props => {
	return new Promise( async (resolve, reject) => {
		removeCommentByKey(props)
			.then(data => {
				Actions.modal({
					header: 'Complete',
					message: 'Comment has been removed',
					onComplete:() => {
						if(props.onComplete) props.onComplete()
					}
				})
			})
			.catch(err => {
				Actions.modal({
					header: 'Error',
					message: 'Oops, an error has occurred',
					onComplete:() => {}
				})
			})
	})
}
export {removeCommentByKeyAction}

const blockUserAction = async props => {
	return new Promise( async (resolve, reject) => {

    const onComplete = props.onComplete
    const data = props
    delete data.onComplete

    try {

      const doubleCheckStatus = await doubleCheck({message: `Are you sure you want to block ${props.userBlockedDisplayName}?`})
      const blockUserStatus = blockUser(data)

      blockUserStatus.then(data => {
        Actions.modal({
          header: 'Complete',
          message: `${props.userBlockedDisplayName} has been blocked`,
          onComplete:() => {if(onComplete) onComplete()}
        })
      })

      blockUserStatus.catch(err => {
        if(__DEV__) {
          console.log(err)
        }
        Actions.modal({
          header: 'Error',
          message: `${props.userBlockedDisplayName} has already been blocked`,
          onComplete: () => {}
        })
      })
    }

    catch(err) {
      if(__DEV__) {
        console.log(err)
      }
      reject(err)
    }
	})
}
export {blockUserAction}

const loginUser = props => {
	return new Promise((resolve,reject) => {
		login(props)
			.then( user => {
				saveLoginStateToLocalStorage(props)
				Actions.user = props
				resolve(user)
			})
			.catch( err => {
				reject(err)
			})
	})
}
export {loginUser}

const registerNewUser = props => {
	return new Promise((resolve,reject) => {
		register(props)
			.then( user => {
				saveLoginStateToLocalStorage(props)
				Actions.user = props
				resolve(user)
			})
			.catch( err => {
				reject(err)
			})
	})
}
export {registerNewUser}