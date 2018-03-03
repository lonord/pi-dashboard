import {
	Dialog,
	DialogProps
} from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'
import { modulePackage } from '../../util/remote'
import SubTitle from './part/sub-title'
import Title from './part/title'

const pkg = modulePackage

export default class AboutDialog extends React.Component<DialogProps, any> {
	render() {
		return (
			<Dialog {...this.props} title="关于">
				<Title>PI DASHBOARD</Title>
				<SubTitle>ver {pkg.version}</SubTitle>
				<SubTitle>by {pkg.author}</SubTitle>
			</Dialog>
		)
	}
}
