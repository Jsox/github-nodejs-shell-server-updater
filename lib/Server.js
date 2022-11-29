const http = require('http');
const createHandler = require('github-webhook-handler');
const Shell = require('./Shell');

module.exports = class Server {
    constructor(repos, git_hub_listen_port = 6768) {
        this.port = git_hub_listen_port;
        this.repos = repos;
        this.listen();
    }

    listen() {
        http.createServer(function (req, res) {
            this.repos.map((config) => {
                const { git_hub_secret, git_hub_repo_name } = config;

                let handler = createHandler({ path: '/github_update_hook', secret: git_hub_secret });
                handler(req, res, function (err) {
                    {
                        err && console.log('Error:', err);
                    }
                    res.statusCode = 404;
                    res.end('404');
                });

                handler.on('error', function (err) {
                    console.error('Error:', err.message);
                });

                handler.on('push', function (event) {
                    const repoName = event.payload.repository.name;
                    const action = event.event;

                    console.log('Received a Push Request for %s to %s', repository, action);

                    if (repoName === git_hub_repo_name && action === 'push') {
                        Shell.buildAndStart(config);
                    }
                });
            });
        }).listen(this.port);
    }
};
