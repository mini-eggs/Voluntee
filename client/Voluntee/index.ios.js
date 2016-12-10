import React from 'react'
import {AppRegistry} from 'react-native'
import codePush from 'react-native-code-push'
import Voluntee from './src/'

const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME}

class CodePush extends React.Component {

	async componentDidMount() {
		codePush.sync({
            updateDialog: true,
            installMode: codePush.InstallMode.IMMEDIATE
        })
	}

	render() {
		return (
			<Voluntee/>
		)
	}
}

const appBundle = codePush(codePushOptions)(CodePush)

AppRegistry.registerComponent('Voluntee', props => appBundle)
