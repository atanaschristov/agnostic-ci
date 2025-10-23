import { useMemo } from 'react';
import MockedContexts from '../../../__mocks__/contexts/';

const getSchema = () => {
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
