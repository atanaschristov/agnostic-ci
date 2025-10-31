export const OptionsWelcomeScreen = () => {
	return (
		<div className="welcome-message">
			<hr />
			<h3>Command Options Interface Demo</h3>
			<ul>
				<li>
					Commands can be executed by mouse clicking on them or pressing the numeric key
					corresponding to the number of the option to select a command.
				</li>
				<li>
					If a command needs arguments, a modal will pop up asking for the required arguments.
				</li>
				<li>
					The modal can always be canceled but for the command execution to be allowed, the
					arguments need to be validated against the requirements from the command schema.
				</li>
			</ul>
		</div>
	);
};
