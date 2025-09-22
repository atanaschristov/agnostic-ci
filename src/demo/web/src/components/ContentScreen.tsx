import bem from 'bem-cn';
import { JSX, useEffect, useRef, useState } from 'react';
import { VueScreen } from './VueScreen';

import './ContentScreen.scss';

export interface IScreenItem {
	success: boolean;
	content: string | JSX.Element | Promise<JSX.Element>;
}

interface IContentScreenProps {
	messageItem?: IScreenItem;
	className: string;
}

export const ContentScreen = (props: IContentScreenProps) => {
	const { messageItem, className } = props;
	const b = bem('content-screen');
	const bottomOfTheScreenRef = useRef<null | HTMLInputElement>(null);

	const [screenContent, setScreenContent] = useState<Array<JSX.Element>>([<VueScreen key={0} />]);

	useEffect(() => {
		if (bottomOfTheScreenRef) {
			bottomOfTheScreenRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [screenContent, className]);

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
	}, [messageItem]);

	return (
		<div className={b({ mode: className })}>
			{screenContent}
			<div ref={bottomOfTheScreenRef}></div>
		</div>
	);
};
