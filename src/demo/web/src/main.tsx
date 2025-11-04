import { AppContextProvider } from './contexts/AppContext.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

import './main.scss';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppContextProvider>
			<App />
		</AppContextProvider>
	</StrictMode>,
);
