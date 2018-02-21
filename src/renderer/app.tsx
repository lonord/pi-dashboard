import * as React from 'react'
import styled, { injectGlobal } from 'styled-components'
import DateTime from './components/datetime'
import Logo from './components/logo'
import Toolbar from './components/toolbar'
import Content from './layouts/content'
import Header from './layouts/header'
import Main from './layouts/main'

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
		-webkit-user-select: none;
	}
	#react-root {
		height: 100%;
	}
`

export default () => (
	<Main>
		<Header>
			<Logo />
			<DateTime />
			<Toolbar />
		</Header>
		<Content>
			content
		</Content>
	</Main>
)
