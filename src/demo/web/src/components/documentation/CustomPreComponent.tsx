import { ExtraProps } from 'react-markdown';

export const CustomPreComponent: React.ComponentType<
	React.ClassAttributes<HTMLPreElement> & React.HTMLAttributes<HTMLPreElement> & ExtraProps
> = (parameters) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { node, ...props } = parameters;
	return (
		<pre
			{...props}
			style={{
				maxWidth: '100%',
				overflowX: 'auto',
				boxSizing: 'border-box',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				borderRadius: '8px',
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				marginRight: '0.5em',
				padding: '1em',
			}}
		/>
	);
};
