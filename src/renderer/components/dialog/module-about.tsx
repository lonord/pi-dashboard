import {
	Dialog,
	DialogProps
} from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'
import SubTitle from './part/sub-title'
import Title from './part/title'

export interface ModuleAboutDialogProps extends DialogProps {
	displayName: string
	moduleName: string
	version: string
}

export default class ModuleAboutDialog extends React.Component<ModuleAboutDialogProps, any> {
	render() {
		const { displayName, moduleName, version, ...rest } = this.props
		return (
			<Dialog {...rest} title="关于模块">
				<Title>{displayName}</Title>
				<SubTitle>{moduleName}</SubTitle>
				<SubTitle>ver {version}</SubTitle>
			</Dialog>
		)
	}
}
