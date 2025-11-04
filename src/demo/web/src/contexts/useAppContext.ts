import { createContext, useContext } from 'react';

export type DemoOptions = 'cli' | 'options';

export interface IAppContext {
	selectedDemo: DemoOptions;
	setSelectedDemo?: (demo: DemoOptions) => void;
}

export const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppContext = () => {
	return useContext(AppContext);
};
