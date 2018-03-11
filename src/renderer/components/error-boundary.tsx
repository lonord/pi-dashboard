import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'

interface ErrorBoundaryState {
	error: any
	errorInfo: any
}
export default class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {

	state: ErrorBoundaryState = {
		error: null,
		errorInfo: null
	}

	componentDidCatch(error, info) {
		this.setState({
			error,
			errorInfo: info
		})
	}

	render() {
		if (this.state.errorInfo) {
			return (
				<ErrorView>
					<h2>Something went wrong.</h2>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}
					</details>
				</ErrorView>
			)
		}
		return this.props.children
	}
}

const ErrorView = styled.div`
	color: red;
	font-size: 12px;
	font-family: Menlo, monospace;
	position: absolute;
	width: 100%;
	height: 100%;
	overflow-y: scroll;
`
