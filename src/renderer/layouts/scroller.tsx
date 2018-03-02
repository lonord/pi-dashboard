import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const ScrollerWrap = styled.div`
	user-select: none;
	overflow-x: scroll;

	&::-webkit-scrollbar {
		height: 3px;
	}

	&::-webkit-scrollbar-thumb {
		background: #f0f0f0;
		height: 3px;
		border-radius: 1px;
	}
`

export default class Scroller extends React.Component<React.HTMLAttributes<HTMLDivElement>, any> {

	dragging = false
	element: HTMLDivElement = null
	lastPosition: number | null = null

	onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
		this.dragging = true
		this.lastPosition = null
	}

	onDragStop = (e: React.MouseEvent<HTMLDivElement>) => {
		this.dragging = false
	}

	onDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!this.dragging || !this.element) {
			return
		}
		const thisPosition = e.clientX
		if (this.lastPosition !== null) {
			const scrolledPosition = thisPosition - this.lastPosition
			let scrollLeft = this.element.scrollLeft - scrolledPosition
			const width = this.element.scrollWidth - this.element.clientWidth
			if (scrollLeft < 0) {
				scrollLeft = 0
			}
			if (scrollLeft > width) {
				scrollLeft = width
			}
			this.element.scrollLeft = scrollLeft
		}
		this.lastPosition = thisPosition
	}

	onCancel = () => {
		this.dragging = false
	}

	render() {
		return (
			<ScrollerWrap innerRef={(ref) => this.element = ref} {...this.props}
				onMouseDown={this.onDragStart}
				onMouseUp={this.onDragStop}
				onMouseMove={this.onDragMove}
				onMouseLeave={this.onCancel}/>
		)
	}
}
