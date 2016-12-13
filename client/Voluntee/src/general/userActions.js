import {Actions} from 'react-native-router-flux'

import {saveLoginStateToLocalStorage} from './localStorage'
import {login,register,blockUser, removeCommentByKey, hideCommentByKeyAndUserEmail, reportCommentByKey, createMessage} from './firebase'

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
				message: 'Oops, something went wrong'
			})
		})
	})
}
export {createMessageAction}

const reportCommentAction = async props => {
	return new Promise( async (resolve, reject) => {
		reportCommentByKey(props)
			.then(data => {
				Actions.modal({
					header: 'Complete',
					message: 'Comment has been reported'
				})
			})
			.catch(err => {
				Actions.modal({
					header: 'Error',
					message: 'Comment has already been reported',
					onComplete:() => {}
				})
			})
	})
}
export {reportCommentAction}

const hideCommentAction = async props => {
	return new Promise( async (resolve, reject) => {
		const onComplete = props.onComplete
		const data = props
		delete data.onComplete
		hideCommentByKeyAndUserEmail(data)
			.then(data => {
				Actions.modal({
					header: 'Complete',
					message: 'Comment has been hidden',
					onComplete:() => {
						if(onComplete) onComplete()
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
		blockUser(data)
			.then(data => {
				Actions.modal({
					header: 'Complete',
					message: `${props.userBlockedDisplayName} has been blocked`,
					onComplete:() => {
						if(onComplete) onComplete()
					}
				})
			})
			.catch(err => {
				console.log(err)
				Actions.modal({
					header: 'Error',
					message: `${props.userBlockedDisplayName} has already been blocked`,
					onComplete:() => {}
				})
			})
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