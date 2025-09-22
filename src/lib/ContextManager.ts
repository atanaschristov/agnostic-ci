import * as i18next from 'i18next';

import INTERNAL_LOCALES from './strings';

import { CLIContextManager } from './CLIContextManager';
import { ContextManagerBase } from './ContextManagerBase';
import { OptionsContextManager } from './OptionsContextManager';
import { I18N_DEFAULT_NS, I18N_FALLBACK_LANGUAGE } from './constants';

type ManagerType = 'options' | 'cli';
const DEFAULT_CONTEXT_MANAGER = 'cli';

export class ContextManager {
	private static __instance__: ContextManager | undefined = undefined;
	private __managerInstance?: OptionsContextManager | CLIContextManager | ContextManagerBase = //NOSONAR
		undefined;
	private __managerType: ManagerType = DEFAULT_CONTEXT_MANAGER; //NOSONAR
	private __translate: any = undefined;

	// TODO: instatntiate the translation here and pass it to the different instances, Instead of in the base class

	get managerType(): ManagerType {
		return this.__managerType;
	}

	get managerInstance():
		| OptionsContextManager
		| CLIContextManager
		| ContextManagerBase
		| undefined {
		return this.__managerInstance;
	}

	constructor(managerType: ManagerType = DEFAULT_CONTEXT_MANAGER) {
		const resetInstance = managerType !== ContextManager.__instance__?.managerType;
		if (ContextManager.__instance__ !== undefined) {
			if (resetInstance) {
				ContextManager.__instance__.__managerType = managerType;
				ContextManager.__instance__.__managerInstance =
					ContextManager.__instance__.resetManagerInstance(managerType);
			}
			return ContextManager.__instance__;
		}

		this.__managerType = managerType;
		this.__managerInstance = this.resetManagerInstance(this.managerType);

		i18next
			.init({
				lng: I18N_FALLBACK_LANGUAGE,
				defaultNS: I18N_DEFAULT_NS,
				fallbackLng: I18N_FALLBACK_LANGUAGE,
				resources: { ...INTERNAL_LOCALES },
			})
			.then(() => {
				this.__translate = i18next.t.bind(i18next);
			});

		ContextManager.__instance__ = this;
	}

	private resetManagerInstance(
		managerType: ManagerType,
	): OptionsContextManager | CLIContextManager | ContextManagerBase {
		switch (managerType) {
			case 'options':
				return new OptionsContextManager();
			case 'cli':
				return new CLIContextManager();
			default:
				throw new Error(this.__translate('ERRORS.UnsupportedManagerType', { managerType }));
		}
	}
}
