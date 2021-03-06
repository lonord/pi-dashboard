import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled, { injectGlobal } from 'styled-components'
import Logo from './components/logo'
import { slashUtil } from './util/remote-slash'

injectGlobal`
	* {
		box-sizing: border-box;
		margin: 0px;
		padding: 0px;
		border: 0px;
	}
	html {
		background: white;
		width: 100%;
		height: 100%;
	}
	body {
		padding: 8px;
		width: 100%;
		height: 100%;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
		Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
		user-select: none;
	}
	#react-root {
		height: 100%;
	}
`

const Wrap = styled.div`
	padding: 7px 0;
`

const Loading = styled.div`
	padding: 8px 12px;
	font-size: 14px;
	color: #999;
	text-align: center;
`

const SlashScreen = () => (
	<Wrap>
		<Logo />
		<Loading>正在启动...</Loading>
		<LoadStub/>
	</Wrap>
)

let loaded = false

class LoadStub extends React.Component<any, any> {

	componentDidMount() {
		if (!loaded) {
			loaded = true
			setTimeout(() => {
				slashUtil.notifyLoadComplete()
			}, 1)
		}
	}

	render() {
		return null
	}
}

ReactDOM.render(
	<SlashScreen />,
	document.getElementById('react-root')
)
