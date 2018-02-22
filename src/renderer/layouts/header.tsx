import { FlexItemFix, withFlexHorizental, withFlexItemsCenter } from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'

export default withFlexItemsCenter(withFlexHorizental(FlexItemFix.extend`
	height: 40px;
`))
