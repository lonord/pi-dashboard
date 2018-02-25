import {
	Dialog,
	DialogProps
} from '@lonord/react-electron-components'
import { remote } from 'electron'
import * as React from 'react'
import styled from 'styled-components'

const pkg = remote.require('../../package.json')

const Title = styled.div`
	font-size: 18px;
	font-family: "Helvetica Neue", Helvetica, Arial;
	font-weight: bold;
	padding: 10px 0;
`

const Version = styled.div`
	font-size: 14px;
	padding: 0 0 10px;
`

const Author = styled.div`
	font-size: 14px;
	padding: 0 0 10px;
`

export default class AboutDialog extends React.Component<DialogProps, any> {
	render() {
		return (
			<Dialog {...this.props} title="关于">
				<Title>PI DASHBOARD</Title>
				<Version>ver {pkg.version}</Version>
				<Author>by {pkg.author}</Author>
			</Dialog>
		)
	}
}
