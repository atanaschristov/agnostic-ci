const DocumentationEntry = () => {
	return (
		<>
			<h2>Documentation section</h2>
			<p>
				Under construction. It should provide manuals and guides for using the application and
				the library.
			</p>
			<div>Available commands:</div>
			<ul>
				<li>{`list - Lists all the available files`}</li>
				<li>{`show {num|string} - Shows the content of the specified file. file names can be partially written`}</li>
			</ul>
		</>
	);
};

export default DocumentationEntry;
