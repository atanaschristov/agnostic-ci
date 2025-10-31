import bem from 'bem-cn';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { VueScreen } from './VueScreen';

import './ContentScreen.scss';
import { CLIWelcomeScreen } from './CLIWelcomeScreen';
import { OptionsWelcomeScreen } from './OptionsWelcomeScreen';

export interface IScreenItem {
	success: boolean;
	content: string | JSX.Element | Promise<JSX.Element>;
}

interface IContentScreenProps {
	messageItem?: IScreenItem;
	selectedDemo: string;
}

export const ContentScreen = (props: IContentScreenProps) => {
	const { messageItem, selectedDemo } = props;
	const b = useMemo(() => bem('content-screen'), []);
	const bottomOfTheScreenRef = useRef<null | HTMLInputElement>(null);

	const [screenContent, setScreenContent] = useState<Array<JSX.Element>>([]);

	useEffect(() => {
		if (bottomOfTheScreenRef) {
			bottomOfTheScreenRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [screenContent, selectedDemo]);

	useEffect(() => {
		const { success, content } = messageItem || {};
		if (success !== undefined && content) {
			const isString = typeof content === 'string' || content instanceof String;

			const addItem = (resolvedContent: JSX.Element | string) => {
				setScreenContent((currentScreenContent) => [
					...currentScreenContent,
					<div
						className={b('item', { error: !success && isString })}
						key={currentScreenContent.length}
					>
						{resolvedContent}
					</div>,
				]);
			};

			if (content instanceof Promise) {
				content.then((resolvedContent) => addItem(resolvedContent));
			} else {
				addItem(content);
			}
		}
	}, [b, messageItem]);

	return (
		<div className={b({ mode: selectedDemo })}>
			<VueScreen />
			{selectedDemo === 'cli' ? <CLIWelcomeScreen /> : <OptionsWelcomeScreen />}
			{screenContent}
			<div ref={bottomOfTheScreenRef}></div>
		</div>
	);
};
