import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'

interface ErrorBoundaryState {
	errMsg: string
}
export default class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {

	state: ErrorBoundaryState = {
		errMsg: null
	}

	componentDidCatch(error, info) {
		this.setState({
			errMsg: info || error.message || error
		})
	}

	render() {
		if (this.state.errMsg) {
			return (
				<ErrorView>{this.state.errMsg}</ErrorView>
			)
		}
		return this.props.children
	}
}

const ErrorView = styled.div`
	color: red;
	font-size: 12px;
	font-family: Menlo, monospace;
`
