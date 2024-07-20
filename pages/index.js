import readme from '../readme.md'

export default function Index() {
	// console.info(readme)
	const preStyles = {
		'boxSizing': 'border-box',
		'padding': '1rem',
		'width': '100%',
		'maxWidth': '80rem',
		'whiteSpace': 'pre-wrap',
		'fontSize': '1rem'
	}
	return (
		<pre style={preStyles}>
			{readme}
		</pre>
	)
}
