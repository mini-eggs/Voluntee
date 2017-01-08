import ImagePicker from 'react-native-image-picker'
import {screenHeight, screenWidth, screenArea, actionBarHeight, tabBarHeight, buttonHeight, statusbarHeight, tabbarOffset} from './screen'

export {screenHeight}
export {screenWidth}
export {screenArea}
export {actionBarHeight}
export {tabBarHeight}
export {buttonHeight}
export {statusbarHeight}
export {tabbarOffset}

// small avi image config
const defaultPhotoConfig = {
	mediaType:'photo',
	quality:0.1,
	maxWidth:200,
	maxHeight:200
}

const theme = {
  primaryFontColor: '#000000',
  secondaryFontColor: '#4e4e4e',
  linkFontColor: '#0000EE',
  headerFontColor: '#cc5c5c'
}
export {theme}

const defaultBackgroundColor = '#ffffff'
export {defaultBackgroundColor}

const defaultTextColor = '#ffffff'
export {defaultTextColor}

// original dark green 649c7a
const darkGreen = '#cc5c5c'
export {darkGreen}

// const lightGreen = '#8edbac' // the original green the app used
const lightGreen = '#ff7373' // pale blue 9abfcb ? or gameboy color aqua 2ca3ae ?
export {lightGreen}

const facebookBlue = '#91a1c4'
export {facebookBlue}

const defaultGrey = '#bdbdbd'
export {defaultGrey}

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