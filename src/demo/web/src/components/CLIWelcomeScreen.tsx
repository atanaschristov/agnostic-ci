export const CLIWelcomeScreen = () => {
	return (
		<div className="welcome-message">
			<hr />
			<h3>Command Line Interface Demo!</h3>
			<ul>
				<li>Commands are executed by typing them in the prompt and pressing 'Enter'.</li>
				<li>
					Use the 'Tab' key to autocomplete commands or arguments, or to show available
					commands.
				</li>
				<li>Use the 'Up' and 'Down' arrow keys to navigate through the command history.</li>
				<li>
					Type '<code>help</code>' or <code>?</code> to see available commands.
				</li>
				<li>
					Press '<code>Tab</code> to autocomplete next command or argument or to show the
					available commands
				</li>
				<li>
					When an executed command refers to a context, its action will be requested and the
					context and the prompt will change giving access to its own context specific
					commands.
				</li>
				<li>
					Type '<code>back</code>' to go back to the previous context.
				</li>
				<li>
					Type '<code>config</code>' to configure some aspects of the prompt as well as to
					change the language.
				</li>
			</ul>
		</div>
	);
};
