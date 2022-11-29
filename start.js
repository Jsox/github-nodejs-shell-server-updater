//yarn add shelljs dotenv github-webhook-handler

const Deploy = require('./lib/Deploy');
const Server = require('./lib/Server');

module.exports = class DeployFromGithubAndListenForUpdates {
    constructor(config) {
        new Deploy(config);
        new Server(config);
    }
};
