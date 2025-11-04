import { useAppContext } from '../contexts/useAppContext';

import { CLIWelcomeScreen } from './CLIWelcomeScreen';
import { OptionsWelcomeScreen } from './OptionsWelcomeScreen';

const WelcomeScreen = () => {
	const { selectedDemo } = useAppContext() || {};
	if (selectedDemo === 'cli') {
		return <CLIWelcomeScreen />;
	} else if (selectedDemo === 'options') {
		return <OptionsWelcomeScreen />;
	}
};

export default WelcomeScreen;
