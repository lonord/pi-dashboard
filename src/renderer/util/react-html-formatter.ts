/**
 * 替换空格为&nbsp;
 * 替换\n为<br/>
 * 替换<为&lt;
 * 替换>为&gt;
 * 替换&为&amp;
 * 替换"为&quot;
 */
export default function formatHTMLText(text: string) {
	text = text || ''
	let result: string = ''
	for (const ch of text) {
		let escape = ''
		switch (ch) {
			case ' ':
				escape = '&nbsp;'
				break
			case '\n':
				escape = '<br/>'
				break
			case '<':
				escape = '&lt;'
				break
			case '>':
				escape = '&gt;'
				break
			case '&':
				escape = '&amp;'
				break
			case '"':
				escape = '&quot;'
				break
			default:
				escape = ch
		}
		result += escape
	}
	return result
}
