import {
	Dialog,
	DialogProps
} from '@lonord/react-electron-components'
import * as React from 'react'
import { mainProcActions } from '../../util/remote'
import Button from '../button'

interface UpdateDialogState {
	status: 'checking' | 'error' | 'downloading' | 'avaliable' | 'not-avaliable'
	errorMsg: string
}

export default class UpdateDialog extends React.Component<DialogProps, UpdateDialogState> {

	state: UpdateDialogState = {
		status: 'checking',
		errorMsg: null
	}

	downloadAndInstall = () => {
		this.setState({
			status: 'downloading'
		})
		mainProcActions.downloadAndInstallUpdate((err) => {
			if (err) {
				this.setState({
					status: 'error',
					errorMsg: err.message || '发生错误'
				})
			}
		})
	}

	checkUpdate = () => {
		mainProcActions.checkUpdate((err, updateAvailable) => {
			if (err) {
				this.setState({
					status: 'error',
					errorMsg: err.message || '发生错误'
				})
			} else {
				this.setState({
					status: updateAvailable ? 'avaliable' : 'not-avaliable'
				})
			}
		})
	}

	render() {
		const { status, errorMsg } = this.state
		const { onClose } = this.props
		const buttons = []
		const errStr = errorMsg || '未知错误'
		let child: any = null
		if (status === 'error') {
			child = (
				<span>{errStr}</span>
			)
			buttons.push(
				<Button key="cancel" onClick={onClose}>关闭</Button>
			)
		} else if (status === 'checking') {
			child = (
				<span>正在检查更新...</span>
			)
		} else if (status === 'downloading') {
			child = (
				<span>正在更新...</span>
			)
		} else if (status === 'avaliable') {
			child = (
				<span>发现新版本，是否下载并安装？</span>
			)
			buttons.push(
				<Button key="cancel" onClick={onClose}>取消</Button>
			)
			buttons.push(
				<Button key="install" primary={true} onClick={this.downloadAndInstall}>安装</Button>
			)
		} else if (status === 'not-avaliable') {
			child = (
				<span>当前已经是最新版本</span>
			)
			buttons.push(
				<Button key="cancel" onClick={onClose}>关闭</Button>
			)
		} else {
			child = (
				<span>未知状态</span>
			)
			buttons.push(
				<Button key="cancel" onClick={onClose}>关闭</Button>
			)
		}
		return (
			<Dialog {...this.props} showClose={false} spaceClickClosable={false} title="更新" buttons={buttons}>
				{child}
				<RenderReporter onMount={this.checkUpdate}/>
			</Dialog>
		)
	}
}

interface RenderReporterProps {
	onMount()
}

class RenderReporter extends React.Component<RenderReporterProps, any> {

	componentDidMount() {
		const { onMount } = this.props
		onMount && onMount()
	}

	render() {
		return null
	}
}
