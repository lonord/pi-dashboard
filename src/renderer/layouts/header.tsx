import { FlexItemFix, withFlexAlignItemsCenter, withFlexHorizental } from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'

export default withFlexAlignItemsCenter(withFlexHorizental(FlexItemFix.extend`
	height: 40px;
`))
