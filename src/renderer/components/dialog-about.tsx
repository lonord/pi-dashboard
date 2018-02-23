import {
	Dialog,
	DialogProps
} from '@lonord/react-electron-components'
import * as React from 'react'

export default class AboutDialog extends React.Component<DialogProps, any> {
	render() {
		return (
			<Dialog {...this.props} title="关于">
				about info
			</Dialog>
		)
	}
}
