import {Dimensions} from 'react-native'
import ImagePicker from 'react-native-image-picker'

// small avi image config
const defaultPhotoConfig = {
	mediaType:'photo',
	quality:0.1,
	maxWidth:200,
	maxHeight:200
}

// original dark green 649c7a
const darkGreen = '#cc5c5c'
export {darkGreen}

// const lightGreen = '#8edbac' // the original green the app used
const lightGreen = '#ff7373' // pale blue 9abfcb ? or gameboy color aqua 2ca3ae ?
export {lightGreen}

const facebookBlue = '#91a1c4'
export {facebookBlue}

const actionBarHeight = 65
export {actionBarHeight}

const tabBarHeight = 50
export {tabBarHeight}

const defaultGrey = '#bdbdbd'
export {defaultGrey}

const screenHeight = Dimensions.get('window').height
export {screenHeight}

const screenWidth = Dimensions.get('window').width
export {screenWidth}

const screenArea = screenHeight - tabBarHeight - actionBarHeight
export {screenArea}

const imagePicker = async props => {
	return new Promise( async (resolve, reject) => {
		ImagePicker.showImagePicker(defaultPhotoConfig, resolve)
	})
}

const getPhoto = async props => {
	return new Promise( async (resolve, reject) => {
		const imageData = await imagePicker()
		if(imageData.didCancel || imageData.error || imageData.customButton) reject()
		else resolve(imageData.data)
	})
}
export {getPhoto}