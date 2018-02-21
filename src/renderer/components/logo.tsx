import {
	FlexItemAdaptive,
	withFlexHorizental,
	withFlexItemsCenter,
	withItemFix
} from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'

const LogoWrap = withFlexItemsCenter(withFlexHorizental(styled(FlexItemAdaptive)`
	-webkit-app-region: drag;
	cursor: move;
	height: 100%;
`))
const LogoImage = styled.img`
	height: 30px;
	padding: 0 10px 0;
`
const LogoImageFixItem = withItemFix(LogoImage)
const LogoText = styled.span`
	font-size: 18px;
	font-family: "Helvetica Neue", Helvetica, Arial;
	font-weight: bold;
`

export default () => (
	<LogoWrap>
		<LogoImageFixItem src="resource/image/pi.png"/>
		<LogoText>PI DASHBOARD</LogoText>
	</LogoWrap>
)
