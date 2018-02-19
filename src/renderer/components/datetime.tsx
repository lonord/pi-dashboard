import * as fecha from 'fecha'
import * as React from 'react'
import { FlexItemFix } from '../layouts/flex'

const DateTimeText = FlexItemFix.extend`
	padding: 0 40px 0 0;
	font-family: monospace;
	font-size: 16px;
	font-weight: bold;
	color: #666;
	height: 18px;
	line-height: 20px;
`

interface DateTimeState {
	timestamp: number
}

export default class DateTime extends React.Component<any, DateTimeState> {

	state: DateTimeState = {
		timestamp: new Date().getTime()
	}

	timer: any = null

	onUpdate = () => {
		this.setState({
			timestamp: new Date().getTime()
		})
	}

	componentDidMount() {
		this.timer = setInterval(this.onUpdate, 1000)
	}

	componentWillUnmount() {
		clearInterval(this.timer)
	}

	render() {
		const dateTimeStr = fecha.format(this.state.timestamp, 'YYYY-MM-DD HH:mm')
		return (
			<DateTimeText>{dateTimeStr}</DateTimeText>
		)
	}
}
