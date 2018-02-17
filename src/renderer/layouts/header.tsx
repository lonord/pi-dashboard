import * as React from 'react'
import styled from 'styled-components'
import { FlexItemFix, withFlexHorizentalCenter } from './flex'

export default withFlexHorizentalCenter(FlexItemFix).extend`
	height: 40px;
`
