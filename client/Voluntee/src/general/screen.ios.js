import {Dimensions} from 'react-native'

const actionBarHeight = 65
export {actionBarHeight}

const tabbarOffset = actionBarHeight
export {tabbarOffset}

const tabBarHeight = 50
export {tabBarHeight}

const screenHeight = Dimensions.get('window').height
export {screenHeight}

const screenWidth = Dimensions.get('window').width
export {screenWidth}

const screenArea = screenHeight - tabBarHeight - actionBarHeight
export {screenArea}

const buttonHeight = 53
export {buttonHeight}

const statusbarHeight = 22
export {statusbarHeight}