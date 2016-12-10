import {Actions} from 'react-native-router-flux'
import Storage from 'react-native-storage'
import * as firebase from 'firebase'

import {initialStorageOptions,loadUserOptions,saveUserOptions,removeUserOptions} from './localStorage.options'

const startLocalStorage = props => Actions.localStorage = new Storage(initialStorageOptions)
export {startLocalStorage}

const getLoginStatusFromLocalStorage = props => new Promise( (resolve, reject) => {
	Actions.localStorage.load(loadUserOptions)
	.then(user => resolve(user)).catch(err => reject(err))
})
export {getLoginStatusFromLocalStorage}

const saveLoginStateToLocalStorage = props => Actions.localStorage.save(saveUserOptions(props))
export {saveLoginStateToLocalStorage}

const removeLoginStateFromLocalStorage = props => Actions.localStorage.remove(removeUserOptions)
export {removeLoginStateFromLocalStorage}