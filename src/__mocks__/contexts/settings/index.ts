import { IContextContainer } from '../../../lib/types';

import * as CONSTANTS from './constants';
import fontSettings from './fontSettings';
import stylingSettings from './stylingSettings';
import uiSettings from './uiSettings';

export const CONTEXT_NAMES = CONSTANTS.CONTEXT_NAMES;
export const COMMAND_NAMES = CONSTANTS.COMMAND_NAMES;

export default {
	[fontSettings.name]: fontSettings,
	[stylingSettings.name]: stylingSettings,
	[uiSettings.name]: uiSettings,
} as IContextContainer;
