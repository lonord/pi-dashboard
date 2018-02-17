import * as React from 'react'
import styled from 'styled-components'
import { FlexItemAdaptive, withFlexHorizentalCenter, withItemFix } from '../layouts/flex'

const LogoWrap = withFlexHorizentalCenter(styled(FlexItemAdaptive)`
	-webkit-user-select: none;
	-webkit-app-region: drag;
	cursor: move;
	height: 100%;
`)
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
		<LogoImageFixItem src="resource/pi.png"/>
		<LogoText>PI DASHBOARD</LogoText>
	</LogoWrap>
)
