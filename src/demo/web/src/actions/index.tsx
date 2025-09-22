import { IActionResponseParameter } from '../../../../lib/types';

export const ACTIONS = {
	['implicitlyExecuteHelpAction']: async (parameter?: IActionResponseParameter) => {
		return parameter?.value && <div style={{ whiteSpace: 'pre-wrap' }}>{parameter?.value}</div>;
	},
};
