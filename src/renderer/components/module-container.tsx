import {
	FlexItemAdaptive,
	withFlexVertical,
	withInlineFlexVertical,
	withItemAdaptive,
	withItemFix
} from '@lonord/react-electron-components'
import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'
import Scroller from '../layouts/scroller'
import { configUtil, PiConfig } from '../util/remote'
import requireWithoutCache from '../util/require-without-cache'
import ErrorBoundary from './error-boundary'

const ModuleContentWrap = withFlexVertical(withItemAdaptive(styled(Scroller) `
	flex-wrap: wrap;
`))

interface ModuleItem {
	size: 'small' | 'normal'
	Comp: React.ComponentType<any>
	props: { [key: string]: any }
}
interface ModuleContainerState {
	modules: ModuleItem[]
}
export default class ModuleContainer extends
	React.Component<React.HTMLAttributes<HTMLDivElement>, ModuleContainerState> {

	state: ModuleContainerState = {
		modules: []
	}

	onUpdated = (config: PiConfig) => {
		const modules: ModuleItem[] = []
		const nodeModulesPath = configUtil.getNodeModulesDirectory()
		for (const moduleName in config.modules) {
			const m = requireWithoutCache(`${nodeModulesPath}/${moduleName}`)
			if (m) {
				const moduleObj = m.default || m
				if (moduleObj.size && moduleObj.Comp) {
					modules.push({
						size: moduleObj.size === 'small' ? 'small' : 'normal',
						Comp: moduleObj.Comp,
						props: config.modules[moduleName]
					})
				} else {
					console.warn(`Could not load module '${moduleName}'`)
				}
			}
		}
		this.setState({
			modules
		})
	}

	componentDidMount() {
		this.onUpdated(configUtil.getConfig())
		configUtil.addListener('updated', this.onUpdated)
	}

	componentWillUnmount() {
		configUtil.removeListener('updated', this.onUpdated)
	}

	render() {
		const { modules } = this.state
		return (
			<ModuleContentWrap>
				{modules.map((m, idx) => m.size === 'small'
					? (
						<SmallModuleItem>
							<m.Comp key={idx} {...m.props} />
						</SmallModuleItem>
					)
					: (
						<ModuleItem>
							<m.Comp key={idx} {...m.props} />
						</ModuleItem>
					)
				)}
				<ModuleItem>1</ModuleItem>
				<SmallModuleItem>2</SmallModuleItem>
				<SmallModuleItem>3</SmallModuleItem>
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
`

class RawModuleItem extends React.Component<React.HTMLAttributes<HTMLDivElement>, any> {
	render() {
		const { children, ...rest } = this.props
		return (
			<div {...rest}>
				<ModuleItemContentWrap>
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
