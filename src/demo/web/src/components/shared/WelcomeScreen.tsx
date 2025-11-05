import { CLIWelcomeScreen } from '../demoCLI/CLIWelcomeScreen';
import { OptionsWelcomeScreen } from '../demoOptions/OptionsWelcomeScreen';
import { useAppContext } from '../../contexts/useAppContext';

const WelcomeScreen = () => {
	const { selectedDemo } = useAppContext() || {};
	if (selectedDemo === 'cli') {
		return <CLIWelcomeScreen />;
	} else if (selectedDemo === 'options') {
		return <OptionsWelcomeScreen />;
	}
};

export default WelcomeScreen;
