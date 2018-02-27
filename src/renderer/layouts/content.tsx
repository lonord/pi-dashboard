import { FlexItemAdaptive, withFlexVertical } from '@lonord/react-electron-components'
import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const Content = withFlexVertical(FlexItemAdaptive.extend`
	padding: 16px 8px 8px;
	overflow-x: scroll;
`)

export default Content
