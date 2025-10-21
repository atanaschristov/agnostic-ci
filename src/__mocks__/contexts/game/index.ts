import { IContextContainer } from '../../../lib/types';

import * as CONSTANTS from './constants';
import game from './game';
import bodyConfiguration from './bodyConfiguration';
import characterConfiguration from './characterConfiguration';
import headConfiguration from './headConfiguration';
import hairConfiguration from './hairConfiguration';

export const CONTEXT_NAMES = CONSTANTS.CONTEXT_NAMES;
export const COMMAND_NAMES = CONSTANTS.COMMAND_NAMES;

export default {
	[bodyConfiguration.name]: bodyConfiguration,
	[game.name]: game,
	[characterConfiguration.name]: characterConfiguration,
	[headConfiguration.name]: headConfiguration,
	[hairConfiguration.name]: hairConfiguration,
} as IContextContainer;
