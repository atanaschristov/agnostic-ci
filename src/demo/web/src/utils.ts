import { useMemo } from 'react';
import MockedContexts, { CONTEXT_NAMES, COMMAND_NAMES } from '../../../__mocks__/contexts/';

const getSchema = () => {
	// CLEANUP DEV context used purely for testing.
	// TODO: eventually we should move the other mocks into the vite app
	if (__APP_ENV__ === 'production') {
		delete MockedContexts[CONTEXT_NAMES.MULTI_LEVEL.LEVEL_1];
		delete MockedContexts[CONTEXT_NAMES.LOBBY.LOBBY].commands[
			COMMAND_NAMES.LOBBY.LOBBY_MULTI_LEVEL
		];
	}
	return {
		...MockedContexts,
	};
};

export const useSchema = () => {
	return useMemo(() => {
		const SCHEMA = getSchema();
		return {
			LOCALES: undefined,
			SCHEMA,
		};
	}, []);
};

export const prepareStrings = () => {};
