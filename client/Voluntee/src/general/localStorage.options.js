import {AsyncStorage} from 'react-native'

const initialStorageOptions = {
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
	sync: {}
}
export {initialStorageOptions}

const loadUserOptions = {
	key: 'loginState',
	autoSync: true,
	syncInBackground: true
}
export {loadUserOptions}

const saveUserOptions = props => ({
	key: 'loginState',
	rawData: { 
		email: props.email,
		password: props.password,
		displayName: props.username
	},
	expires: null
})
export {saveUserOptions}

const removeUserOptions = {
	key: 'loginState'
}
export {removeUserOptions}