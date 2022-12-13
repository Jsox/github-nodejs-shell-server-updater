//yarn add shelljs dotenv github-webhook-handler

const Deploy = require('./lib/Deploy');
const Server = require('./lib/Server');

module.exports = class Deployer {
	constructor(config) {
		new Deploy(config);
		new Server(config, 6768);
	}
};
