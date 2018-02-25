import {
	Button as RawButton
} from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	primary?: boolean
}

const Button = styled(RawButton as React.ComponentType<ButtonProps>) `
	padding: 6px 12px;
	color: ${({ primary }) => primary ? '#c33a52' : '#333'};
	font-size: 14px;
`

export default Button
