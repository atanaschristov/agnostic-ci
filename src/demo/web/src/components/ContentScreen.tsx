import bem from 'bem-cn';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../contexts/useAppContext';
import { VueScreen } from './VueScreen';
import WelcomeScreen from './WelcomeScreen';

import './ContentScreen.scss';

export interface IScreenItem {
	success: boolean;
	content: string | JSX.Element | Promise<JSX.Element>;
}

interface IContentScreenProps {
	messageItem?: IScreenItem;
}

export const ContentScreen = (props: IContentScreenProps) => {
	const b = useMemo(() => bem('content-screen'), []);
	const bottomOfTheScreenRef = useRef<null | HTMLInputElement>(null);

	const { messageItem } = props;
	const { selectedDemo } = useAppContext() || {};

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
			<WelcomeScreen />
			{screenContent}
			<div ref={bottomOfTheScreenRef}></div>
		</div>
	);
};
