import {Actions} from 'react-native-router-flux'

import {saveLoginStateToLocalStorage} from './localStorage'
import {login,register,blockUser} from './firebase'

const blockUserAction = async props => {
	return new Promise( async (resolve, reject) => {
		blockUser(props)
			.then(data => {
				Actions.modal({
					header: 'Complete',
					message: `${props.userBlockedDisplayName} has been blocked`,
					onComplete:() => {}
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