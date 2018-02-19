import * as React from 'react'
import styled from 'styled-components'
import { FlexItemFix, withFlexHorizental, withFlexItemsCenter } from './flex'

export default withFlexItemsCenter(withFlexHorizental(FlexItemFix.extend`
	height: 40px;
`))
