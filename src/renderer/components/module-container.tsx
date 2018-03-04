import {
	FlexItemAdaptive,
	withFlexVertical,
	withInlineFlexVertical,
	withItemAdaptive,
	withItemFix
} from '@lonord/react-electron-components'
import * as debounce from 'lodash.debounce'
import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'
import Scroller from '../layouts/scroller'
import clearModule from '../util/clear-module'
import { configUtil, PiConfig } from '../util/remote'
import ModuleAboutDialog from './dialog/module-about'
import ErrorBoundary from './error-boundary'

const ModuleContentWrap = withFlexVertical(withItemAdaptive(styled(Scroller) `
	flex-wrap: wrap;
	align-content: flex-start;
`))

interface ModuleItem {
	name: string
	size: 'small' | 'normal'
	Comp: React.ComponentType<any>
	props: { [key: string]: any }
	version: string
	displayName: string
}
interface ModuleContainerState {
	modules: ModuleItem[]
	properties: any
	isAboutOpen: boolean
	aboutModuleName: string
	aboutModuleVersion: string
	aboutModuleID: string
}
export default class ModuleContainer extends
	React.Component<React.HTMLAttributes<HTMLDivElement>, ModuleContainerState> {

	state: ModuleContainerState = {
		modules: [],
		properties: {},
		isAboutOpen: false,
		aboutModuleName: '',
		aboutModuleVersion: '',
		aboutModuleID: ''
	}

	onUpdated = (config: PiConfig) => {
		const modules: ModuleItem[] = []
		const nodeModulesPath = configUtil.getNodeModulesDirectory()
		clearModule(nodeModulesPath)
		for (const moduleName in config.modules) {
			const m = require(`${nodeModulesPath}/${moduleName}`)
			if (m) {
				const moduleObj = m
				if (moduleObj.size && moduleObj.Comp) {
					modules.push({
						size: moduleObj.size === 'small' ? 'small' : 'normal',
						Comp: moduleObj.Comp,
						props: config.modules[moduleName],
						name: moduleName,
						version: moduleObj.version || '-',
						displayName: moduleObj.name || moduleName
					})
				} else {
					console.warn(`Could not load module '${moduleName}'`)
				}
			}
		}
		configUtil.readProperties().then((properties) => {
			this.setState({
				modules,
				properties
			})
		})
	}

	componentDidMount() {
		this.onUpdated(configUtil.getConfig())
		configUtil.addListener('updated', this.onUpdated)
	}

	componentWillUnmount() {
		configUtil.removeListener('updated', this.onUpdated)
	}

	onAboutModuleClose = () => {
		this.setState({
			isAboutOpen: false
		})
	}

	showAboutModule = (mod: ModuleItem) => {
		if (mod) {
			this.setState({
				isAboutOpen: true,
				aboutModuleName: mod.displayName,
				aboutModuleID: mod.name,
				aboutModuleVersion: mod.version
			})
		}
	}

	updateModuleProps = (moduleName: string, moduleProps: any) => {
		const newProperties = {
			...this.state.properties
		}
		newProperties[moduleName] = {
			...newProperties[moduleName],
			...moduleProps
		}
		this.setState({
			properties: newProperties
		}, () => this.saveProperties(newProperties))
	}

	doSaveProperties = (moduleProps: any) => {
		configUtil.writeProperties(moduleProps)
	}

	saveProperties = debounce(this.doSaveProperties, 3000)

	render() {
		const { modules, properties, isAboutOpen, aboutModuleName, aboutModuleVersion, aboutModuleID } = this.state
		return (
			<ModuleContentWrap>
				{modules.map((m, idx) => m.size === 'small'
					? (
						<SmallModuleItem key={idx} onLongTap={() => this.showAboutModule(m)}>
							<m.Comp {...m.props} {...(properties[m.name] || {})}
								updateProps={(props) => this.updateModuleProps(m.name, props)} />
						</SmallModuleItem>
					)
					: (
						<ModuleItem key={idx} onLongTap={() => this.showAboutModule(m)}>
							<m.Comp {...m.props} {...(properties[m.name] || {})}
								updateProps={(props) => this.updateModuleProps(m.name, props)} />
						</ModuleItem>
					)
				)}
				<ModuleAboutDialog
					isOpen={isAboutOpen}
					displayName={aboutModuleName}
					moduleName={aboutModuleID}
					version={aboutModuleVersion}
					onClose={this.onAboutModuleClose}/>
			</ModuleContentWrap>
		)
	}
}

const ModuleItemContentWrap = withFlexVertical(styled(FlexItemAdaptive) `
	padding: 8px;
	box-shadow: 0px 0px 2px 0px #e0e0e0;
`)

const ModuleItemContent = FlexItemAdaptive.extend`
	overflow: hidden;
	position: relative;
`

interface RawModuleItemProps extends React.HTMLAttributes<HTMLDivElement> {
	onLongTap?()
}
class RawModuleItem extends React.Component<RawModuleItemProps, any> {

	downState = {
		x: 0,
		y: 0,
		timestamp: 0
	}
	needCancelClick = false

	onClickDown = (e: React.MouseEvent<HTMLDivElement>) => {
		this.downState = {
			x: e.clientX,
			y: e.clientY,
			timestamp: new Date().getTime()
		}
		this.needCancelClick = false
	}

	onClickUp = (e: React.MouseEvent<HTMLDivElement>) => {
		const { onLongTap } = this.props
		const upState = {
			x: e.clientX,
			y: e.clientY,
			timestamp: new Date().getTime()
		}
		const dx = upState.x - this.downState.x
		const dy = upState.y - this.downState.y
		if (upState.timestamp - this.downState.timestamp > 2000 && Math.sqrt(dx * dx + dy * dy) < 10) {
			onLongTap && onLongTap()
			this.needCancelClick = true
		}
	}

	onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
		if (this.needCancelClick) {
			e.stopPropagation()
		}
	}

	render() {
		const { children, onLongTap, ...rest } = this.props
		return (
			<div {...rest}>
				<ModuleItemContentWrap
					onMouseDown={this.onClickDown}
					onMouseUp={this.onClickUp}
					onClickCapture={this.onClickCapture}>
					<ModuleItemContent>
						<ErrorBoundary>{children}</ErrorBoundary>
					</ModuleItemContent>
				</ModuleItemContentWrap>
			</div>
		)
	}
}

const ModuleItem = withItemFix(withInlineFlexVertical(styled(RawModuleItem) `
	width: 240px;
	height: 240px;
	padding: 4px;
`))

const SmallModuleItem = styled(ModuleItem) `
	height: 120px;
`
