import { IResponse } from './types';

export class ContextResponse extends Error implements IResponse {
	success: boolean;
	message: string;
	code: number;

	constructor({ success, message, code, ...rest }: IResponse) {
		super(message);
		this.name = 'ContextResponse';
		this.success = success;
		this.message = message;
		this.code = code;
		Object.assign(this, rest);
		if ((Error as any).captureStackTrace) {
			(Error as any).captureStackTrace(this, ContextResponse);
		}
	}
}
