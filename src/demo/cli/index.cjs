#!/usr/bin/env node
const { ContextManager } = require('../../../dist/lib/es5/');
const ContextSchema = require('../../../dist/mocks/es5/');
const CLIApp = require('../../../dist/demo/cli/CLIApp').default;
const kit = require('terminal-kit');

const { terminal } = kit;

const cliApp = new CLIApp(terminal, new ContextManager('cli').managerInstance, ContextSchema);
cliApp.start();
