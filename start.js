//yarn add shelljs dotenv github-webhook-handler

const Deploy = require('./lib/Deploy');
const Server = require('./lib/Server');

module.exports = class Deployer {
    constructor(config, port = 6768) {
        new Deploy(config);
        new Server(config, port);
    }
};
