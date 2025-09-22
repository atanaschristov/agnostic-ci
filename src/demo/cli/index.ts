import * as kit from 'terminal-kit';
import * as Mocks from '../../__mocks__/contexts';

import { CLIContextManager } from '../../lib/CLIContextManager';
import { ContextManager } from '../../lib/ContextManager';
import CLIApp from './CLIApp';

const { terminal } = kit;

const managerInstance = new ContextManager('cli').managerInstance as CLIContextManager;
const cliApp = new CLIApp(terminal, managerInstance, Mocks);
cliApp.start();
