import {
	FlexItemAdaptive,
	withBoxShadow,
	withFlexVertical,
	withInlineFlexVertical,
	withItemAdaptive,
	withItemFix
} from '@lonord/react-electron-components'
import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'
import Scroller from '../layouts/scroller'

const ModuleContentWrap = withFlexVertical(withItemAdaptive(styled(Scroller) `
	flex-wrap: wrap;
`))

export default class ModuleContainer extends React.Component<React.HTMLAttributes<HTMLDivElement>, any> {
	render() {
		return (
			<ModuleContentWrap>
				<ModuleItem>1</ModuleItem>
				<SmallModuleItem>2</SmallModuleItem>
				<SmallModuleItem>3</SmallModuleItem>
				<ModuleItem>4</ModuleItem>
				<ModuleItem>5</ModuleItem>
				<ModuleItem>6</ModuleItem>
				<ModuleItem>7</ModuleItem>
				<ModuleItem>8</ModuleItem>
				<ModuleItem>9</ModuleItem>
				<ModuleItem>10</ModuleItem>
				<ModuleItem>11</ModuleItem>
				<ModuleItem>12</ModuleItem>
				<ModuleItem>13</ModuleItem>
				<ModuleItem>14</ModuleItem>
				<ModuleItem>15</ModuleItem>
				<ModuleItem>16</ModuleItem>
				<ModuleItem>17</ModuleItem>
				<ModuleItem>18</ModuleItem>
			</ModuleContentWrap>
		)
	}
}

const ModuleItemContentWrap = withFlexVertical(withBoxShadow(styled(FlexItemAdaptive) `
	padding: 8px;
`))

class RawModuleItem extends React.Component<React.HTMLAttributes<HTMLDivElement>, any> {
	render() {
		const { children, ...rest } = this.props
		return (
			<div {...rest}>
				<ModuleItemContentWrap>
					<FlexItemAdaptive>{children}</FlexItemAdaptive>
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
