const Utilities = require('gk-utilities');
const OptionsValidator = require('gk-options-validator');

const APP_OPTIONS_TEMPLATE = {
	debug: 'boolean',
	appName: 'string',
	override: {
		showCallstack: 'boolean',
		defaultLogCount: {
			type: 'number',
			minValue: 1,
		},
		dateFormat: {
			type: 'string',
			acceptedValues: ['EU', 'ISO', 'US'],
		},
	},
};

export default class App {
	// Dynamic options
	SHOW_CALLSTACK = true;
	DEFAULT_LOG_COUNT = 10;
	DATE_FORMAT = 'EU';
	APP_NAME = 'App';
	DEBUG_MODE = false;

	// Data
	LOGS = [];

	constructor(options) {
		const appOptions = new OptionsValidator(APP_OPTIONS_TEMPLATE, options).ToObject();
		this.SetupOptions(appOptions);

		this.Log(`[Init] Starting app: ${this.APP_NAME}`, true);
	}

	SetupOptions(options) {
		this.APP_NAME = options.appName;
		this.DEBUG_MODE = options.debugMode;

		// Override
		this.SHOW_CALLSTACK = options.override?.showCallstack ?? this.SHOW_CALLSTACK;
		this.DEFAULT_LOGS_COUNT = options.override?.defaultLogCount ?? this.DEFAULT_LOGS_COUNT;
		this.DATE_FORMAT = options.override?.dateFormat ?? this.DATE_FORMAT;
	}

	Log(message, overrideDebug) {
		this.LOGS.push({
			date: Utilities.Time.formatDate(new Date()),
			message: message,
		});

		if (this.DEBUG_MODE || overrideDebug) {
			console.log(`[${this.APP_NAME}] ${message}`);
		}
	}

	GetLogs(lastX) {
		lastX = lastX !== undefined ? lastX : this.DEFAULT_LOG_COUNT;
		lastX = lastX === -1 || lastX > this.LOGS.length ? this.LOGS.length : lastX;
		return this.LOGS.slice(this.LOGS.length - lastX);
	}
}

class AppException extends Error {
	constructor(message) {
		super(message);
		this.name = 'AppException';
	}
}
