import React from 'react'
import {View} from 'react-native'
import {Actions} from 'react-native-router-flux'
import ActionSheet from 'react-native-actionsheet'

// EXAMPLE USE

    // Actions.ActionSheet({
    //     onComplete: val => alert(val),
    //     buttons: ['wow', 'hi'],
    //     title: 'test',
    //     cancelIndex:1
    // })

const defaultOnComplete = props => { 
	if(__DEV__) {
		console.log('onComplete for ActionSheetComp has not been set')
	}
}

class ActionSheetComp extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			buttons: ['Hello', 'World'],
			onComplete: defaultOnComplete,
			cancelIndex: 1,
			destruciveIndex:- 1,
			title: 'Development'
		}
	}

	componentDidUpdate() {
		this.bindActions()
	}

	componentDidMount() {
		this.bindActions()
	}

	showActionSheet() {
		// dirty ref
		this.ActionSheet.show()
	}

	// bind Actions events
	// to be used globally
	bindActions() {
		// @props
		// onComplete
		// buttons
		// cancelIndex
		// title
		// &
		// this will be an abstraction
		// so we don't have to worry about
		// changing props AND showing
		// the action sheet within other
		// parts of the app
		// the action sheet will be shown
		// after required props have been mounted 
		// to the component
		Actions.ActionSheet = props => this.fromGlobalActionSheet(props)
	}

	async fromGlobalActionSheet(props) {
		try {
			const status = await this.handleActionSheetChange(props)
			this.showActionSheet(status)
		}
		catch(err) {
			if(__DEV__) {
				console.log('Error occurred in Actions.ActionSheet withing actionSheet.js')
				console.log('Most likely missing params. Error below: ')
				console.log(err)
			}
		}
	}

	// the heavy hard lifting
	async handleActionSheetChange(props) {
		return new Promise( async (resolve, reject) => {
			// check props
			if(!props) {
				if(__DEV__) {
					console.log('You\'re not even trying')
				}
				return reject()
			}
			// double check props
			if(!props.buttons || !props.cancelIndex || !props.onComplete || !props.title) {
				if(__DEV__) {
					console.log('required parameters not found in handleActionSheetChange within actionSheet.js')
				}
				return reject('Required para')
			}
			// create new state object
			const newState = {
				title: props.title,
				buttons: props.buttons,
				onComplete: props.onComplete,
				cancelIndex: props.cancelIndex,
			}
			// propagate it 
			this.setState(newState, resolve)
		})
	}

	render() {
		return (
			<ActionSheet 
          		ref={ ref => this.ActionSheet = ref}
           		title={this.state.title}
               	options={this.state.buttons}
               	cancelButtonIndex={this.state.cancelIndex}
              	destructiveButtonIndex={this.state.destruciveIndex}
               	onPress={ index => { this.state.onComplete(index) }}
           	/>
		)
	}
}

export default ActionSheetComp