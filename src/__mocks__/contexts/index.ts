/* NOTE:
   An example of a context-commands schema. Follow the IContextContainer
   1. Each context can be root(isRootContext). The first found root context is used and made current

   1. The context container contains all the known defined contexts.

   2. Each context has a name and commands mapping, containing a commandId
      refering to a command node object

   3. Each commandNode object contains name, aliases, type, and an action. The type attribute defines
      if the command is a regular command or a context command.

   4. The context commands serve as gateways to other known contexts, defined in the context container
      If such command is executed, its defined action is taken into account and the user is routed to
      the context the command refers to, unlocking the other context commands

   5. A context can contain unlimited ammount of commands and
      can have context commands refering to any other context defined in the context container.

   6. Context loops are allowed, meaning:
      ContectA can have context commands refering to ContextB and ContextC
      ContextB can have context commands allowing access to ContextA and ContexC and
      ContextC can have context commands allowing access to ContextA and ContexB
      this allowing the user to build a treelike as well as graphlike context structures


   Atucompletion for all commands is supported
   Autompletion is supported for some parameters whcih are defined, such as set parameters, or default values
   Automcpletion is not supported for command aliases

   nested command execution is supported which means
   a context command refering to another context as long as it is recognized gives access to all the commands form the other context, thus allowing immediate execution
   example: The user is in ContextA which has commandB refering to ContextB. And ContextB has commandC refering to ContextC which has commandA which refers back to ContextA
   It is possible to execute immediate
   0. "someNormalCommandInContextA"
   1. "commandB commandC someNormalCommandInContextC"
   2. "commandB commandC commandA someNormalCommandInContextA"



*/
import EN_ROOT_STRINGS from './game/strings/en';
import EN_SHARED_COMMANDS from './sharedCommands/strings/en';
import root, {
	CONTEXT_NAMES as ROOT_CONTEXT_NAMES,
	COMMAND_NAMES as ROOT_COMMAND_NAMES,
} from './game/';
import settings, {
	CONTEXT_NAMES as SETTINGS_CONTEXT_NAMES,
	COMMAND_NAMES as SETTINGS_COMMAND_NAMES,
} from './settings';
import SETTINGS_STRINGS from './settings/strings/';
import { IContextContainer } from '../../lib/types';
import { SHARED_COMMAND_NAMES } from './sharedCommands';

export const COMMAND_STRINGS = {
	en: {
		commandsNS: {
			...SETTINGS_STRINGS['en'],
			...EN_ROOT_STRINGS,
			...EN_SHARED_COMMANDS,
		},
	},
	cz: {
		commandsNS: {
			...SETTINGS_STRINGS['cz'],
		},
	},
};

export const CONTEXT_NAMES = {
	ROOT: ROOT_CONTEXT_NAMES,
	SETTINGS: SETTINGS_CONTEXT_NAMES,
};

export const COMMAND_NAMES = {
	ROOT: ROOT_COMMAND_NAMES,
	SETTINGS: SETTINGS_COMMAND_NAMES,
	SHARED: SHARED_COMMAND_NAMES,
};

export default Object.assign({}, root, settings) as IContextContainer;
