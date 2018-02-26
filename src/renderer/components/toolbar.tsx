import {
	createPortalDock,
	Dialog,
	FlexItemFix,
	IconButton,
	MenuItem,
	Separate,
	withMenu
} from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'
import { configUtil } from '../util/remote'
import Button from './button'
import AboutDialog from './dialog-about'
import ExitDialog from './dialog-exit'

const ToolbarIconButton = styled(IconButton) `
	height: 40px;
	width: 40px;
	font-size: 20px;
	color: #aaa;
`

const WarnToolbarIconButton = ToolbarIconButton.extend`
	color: red;
`

const ErrorDialog = styled(Dialog) `
	max-width: 60%;
`

interface InstallStatusButtonState {
	status: 'normal' | 'updating' | 'error'
	isErrorDialogOpen: boolean
	errorMsg: string
}
class InstallStatusButton extends React.Component<any, InstallStatusButtonState> {

	state: InstallStatusButtonState = {
		status: 'normal',
		isErrorDialogOpen: false,
		errorMsg: ''
	}

	onStartUpdate = () => {
		console.log('onStartUpdate')
		this.setState({
			status: 'updating'
		})
	}

	onUpdated = () => {
		console.log('onUpdated')
		this.setState({
			status: 'normal'
		})
	}

	onError = (msg: string) => {
		console.log('onError')
		this.setState({
			status: 'error',
			errorMsg: msg
		})
	}

	openDialog = () => {
		this.setState({
			isErrorDialogOpen: true
		})
	}

	closeDialog = () => {
		this.setState({
			isErrorDialogOpen: false
		})
	}

	retry = () => {
		this.closeDialog()
		configUtil.trigUpdate()
	}

	ignoreError = () => {
		this.closeDialog()
		this.setState({
			errorMsg: '',
			status: 'normal'
		})
	}

	componentDidMount() {
		configUtil.addListener('start-update', this.onStartUpdate)
		configUtil.addListener('updated', this.onUpdated)
		configUtil.addListener('err', this.onError)
	}

	componentWillUnmount() {
		configUtil.removeListener('start-update', this.onStartUpdate)
		configUtil.removeListener('updated', this.onUpdated)
		configUtil.removeListener('err', this.onError)
	}

	render() {
		const { errorMsg, status, isErrorDialogOpen } = this.state
		const buttonNode = status === 'normal'
			? <ToolbarIconButton key="status-normal" icon="sync-alt" onClick={this.retry} />
			: status === 'error'
				? <WarnToolbarIconButton key="status-error" icon="exclamation-circle" onClick={this.openDialog} />
				: <ToolbarIconButton key="status-update" icon="spinner" spin={true} />
		return [
			buttonNode,
			<ErrorDialog key="error-dialog"
				isOpen={isErrorDialogOpen}
				onClose={this.closeDialog}
				title="刷新错误"
				buttons={[
					<Button key="error-dialog-button-ignore" onClick={this.ignoreError}>忽略</Button>,
					<Button key="error-dialog-button-retry" primary={true} onClick={this.retry}>重试</Button>
				]}>
				<div>{errorMsg}</div>
			</ErrorDialog>
		]
	}
}

const MoreMenuWrap = styled.div`
	min-width: 80px;
	font-size: 14px;
	color: #333;
`

const aboutPortal = createPortalDock(AboutDialog)
const AboutDockComp = aboutPortal.DockComp

const exitPortal = createPortalDock(ExitDialog)
const ExitDockComp = exitPortal.DockComp

class MoreMenu extends React.Component<any, any> {
	render() {
		return (
			<MoreMenuWrap>
				<MenuItem onClick={() => aboutPortal.show()}>关于</MenuItem>
				<Separate />
				<MenuItem onClick={() => exitPortal.show()}>退出</MenuItem>
			</MoreMenuWrap>
		)
	}
}

const MoreMenuButton = withMenu((
	<MoreMenu/>
), ToolbarIconButton)

export default () => (
	<FlexItemFix>
		<InstallStatusButton />
		<MoreMenuButton icon="ellipsis-v" />
		<AboutDockComp />
		<ExitDockComp />
	</FlexItemFix>
)
