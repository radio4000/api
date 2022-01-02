import readme from '../readme.md'

export default function Index() {
	// console.info(readme)
	const preStyles = {
		'box-sizing': 'border-box',
		'background-color': 'black',
		'color': 'white',
		'padding': '1rem',
		'width': '100%',
		'max-width': '80rem',
		'white-space': 'pre-wrap',
		'font-size': '1rem'
	}
	return (
		<pre style={preStyles}>
			{readme}
		</pre>
	)
}
