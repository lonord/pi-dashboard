import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const ScrollerWrap = styled.div`
	user-select: none;
`

export default class Scroller extends React.Component<React.HTMLAttributes<HTMLDivElement>, any> {

	onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
		//
	}

	onDragStop = (e: React.MouseEvent<HTMLDivElement>) => {
		//
	}

	onDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
		//
	}

	render() {
		return (
			<ScrollerWrap {...this.props}
				onMouseDown={this.onDragStart}
				onMouseUp={this.onDragStop}
				onMouseMove={this.onDragMove} />
		)
	}
}
