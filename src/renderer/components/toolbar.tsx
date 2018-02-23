import {
	createPortalDock,
	FlexItemFix,
	IconButton,
	MenuItem,
	Separate,
	withMenu
} from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'
import AboutDialog from './dialog-about'

const ToolbarIconButton = styled(IconButton) `
	height: 40px;
	width: 40px;
	font-size: 20px;
	color: #aaa;
`

const MoreMenuWrap = styled.div`
	min-width: 80px;
	font-size: 14px;
	color: #333;
`

const aboutPortal = createPortalDock(AboutDialog)
const AboutDockComp = aboutPortal.DockComp

class MoreMenu extends React.Component<any, any> {
	render() {
		return (
			<MoreMenuWrap>
				<MenuItem onClick={() => aboutPortal.show()}>关于</MenuItem>
				<Separate />
				<MenuItem>设置</MenuItem>
				<Separate />
				<MenuItem>退出</MenuItem>
			</MoreMenuWrap>
		)
	}
}

const MoreMenuButton = withMenu((
	<MoreMenu/>
), ToolbarIconButton)

export default () => (
	<FlexItemFix>
		<MoreMenuButton icon="ellipsis-v" />
		<AboutDockComp/>
	</FlexItemFix>
)
