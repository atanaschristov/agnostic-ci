import bem from 'bem-cn';

import { useCallback, useEffect, useState } from 'react';
// TODO from the library
import { ICommandActionParameter } from '../../../../../lib/types.ts';

import './OverlayModal.scss';

interface PopUpProps {
	onConfirm?: (parameter?: string) => void;
	onClose?: () => void;
	commandName: string;
	parameterInfo?: ICommandActionParameter;
}

export const OverlayModal = (props: PopUpProps) => {
	const b = bem('overlay-modal');
	const { commandName, parameterInfo, onConfirm, onClose } = props;
	const {
		required,
		hint,
		description,
		defaultValue,
		type: parameterType,
		possibleValues,
		valueFormatLimitation,
	} = parameterInfo || {};

	const [inputValue, setInputValue] = useState<string>('');
	const [isValid, setIsValid] = useState<boolean>(true);

	const prepareValue = useCallback(() => {
		let value = inputValue;

		if (parameterType === 'set') {
			let index = parseInt(inputValue.trim());
			if (!isNaN(index) && possibleValues) {
				index = Math.max(1, Math.min(index, possibleValues.length));
				value = possibleValues[index - 1];
			}
		}

		return value;
	}, [defaultValue, inputValue, parameterType, possibleValues]);

	const onKeyUp = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Enter') onConfirm?.(prepareValue());
			if (event.key === 'Escape') onClose?.();
		},
		[onConfirm, onClose, prepareValue],
	);

	useEffect(() => {
		document.addEventListener('keyup', onKeyUp);
		return () => {
			document.removeEventListener('keyup', onKeyUp);
		};
	}, [onKeyUp]);

	const validateInput = useCallback(
		(value: string): boolean => {
			if (parameterType === 'set' && possibleValues && possibleValues.length > 0) {
				const index = parseInt(inputValue.trim());
				if (!isNaN(index)) {
					return index > 0 && index <= possibleValues.length;
				}

				const filteredValues = possibleValues.filter((cmd) => value && cmd.startsWith(value));
				return (value !== '' && filteredValues.length > 0) || (value === '' && !!defaultValue);
			}

			if (parameterType !== 'set' && value !== '' && valueFormatLimitation) {
				const regex = new RegExp(valueFormatLimitation);
				if (!regex.test(value.trim())) {
					return false;
				}
			}

			if (value === '' && required && !defaultValue) {
				return false;
			}

			return true;
		},
		[defaultValue, inputValue, parameterType, possibleValues, required, valueFormatLimitation],
	);

	useEffect(() => {
		setIsValid(validateInput(inputValue));
	}, [defaultValue, inputValue, parameterType, possibleValues, required, valueFormatLimitation]);

	const generateDescription = () => {
		let descriptionText = '';
		switch (parameterType) {
			case 'set':
				descriptionText =
					possibleValues && possibleValues.length > 0
						? possibleValues.map((value, index) => `${index + 1} - ${value}`).join('\n')
						: `${description || ''} ${hint || ''}`;
				break;
			default:
				descriptionText = `${description || ''} ${hint || ''}`;
		}

		return (
			<div>
				<div>{descriptionText}</div>
				<div>{defaultValue ? 'Default: ' + defaultValue : ''}</div>
			</div>
		);
	};

	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;

			setIsValid(validateInput(value));
			setInputValue(value);
		},
		[validateInput],
	);

	const onConfirmClick = useCallback(() => {
		if (!isValid) return;

		onConfirm?.(prepareValue());
	}, [isValid, onConfirm, prepareValue]);

	const onCloseClick = () => {
		onClose?.();
	};

	return (
		<div className={b()}>
			<div className={b('content')}>
				<button className={b('content', 'close')} onClick={onCloseClick}>
					&times;
				</button>{' '}
				<h2>{`Argument for ${commandName}`}</h2>
				<div className="help-space">{generateDescription()}</div>
				<input
					className={b('content', 'input', { invalid: !isValid })}
					type="text"
					placeholder="Enter commands argument"
					onChange={onChange}
					autoFocus
				/>
				<div className={b('content', 'buttons')}>
					<button
						className={b('content', 'buttons', 'confirm', { disable: !isValid })}
						onClick={onConfirmClick}
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};
