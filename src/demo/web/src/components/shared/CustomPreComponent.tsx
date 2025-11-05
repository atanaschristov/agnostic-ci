import bem from 'bem-cn';
import { ExtraProps } from 'react-markdown';
import { useMemo } from 'react';

import './CustomPreComponent.scss';

export const CustomPreComponent: React.ComponentType<
	React.ClassAttributes<HTMLPreElement> & React.HTMLAttributes<HTMLPreElement> & ExtraProps
> = (parameters) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { node, ...props } = parameters;
	const b = useMemo(() => bem('custom-pre'), []);
	return <pre {...props} className={b()} />;
};
