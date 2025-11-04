import { useState } from 'react';
import { AppContext, DemoOptions } from './useAppContext';

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedDemo, setSelectedDemo] = useState<DemoOptions>('cli');

	return (
		<AppContext.Provider value={{ selectedDemo, setSelectedDemo }}>
			{children}
		</AppContext.Provider>
	);
};
