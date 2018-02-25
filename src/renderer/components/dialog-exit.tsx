import {
	Dialog,
	DialogProps
} from '@lonord/react-electron-components'
import * as React from 'react'
import Button from './button'

export default class ExitDialog extends React.Component<DialogProps, any> {

	exit = () => {
		window.close()
	}

	render() {
		return (
			<Dialog {...this.props} title="退出" buttons={[
				<Button key="cancel" onClick={this.props.onClose}>取消</Button>,
				<Button key="exit" primary={true} onClick={this.exit}>退出</Button>
			]}>
				确定要退出吗？
			</Dialog>
		)
	}
}
