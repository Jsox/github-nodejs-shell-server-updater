const http = require('http');
const createHandler = require('github-webhook-handler');
const Shell = require('./Shell');
const fs = require('fs');
let crypto = require('crypto');
var qs = require('querystring');

module.exports = class Server {
	constructor(repos, git_hub_listen_port = 6768) {
		this.port = git_hub_listen_port;

		fs.writeFileSync('./config.json', JSON.stringify(repos));

		this.listen();
	}

	listen() {
		console.log(`Listerning for github Push Requests on port:${this.port}`);
		http.createServer(function (req, res) {
			const repos = JSON.parse(fs.readFileSync('./config.json'));
			let body = '';
			req.on('data', function (data) {
				body += data;
			});
			req.on('end', function () {
				const post = qs.parse(body);
				const payload = JSON.parse(post.payload);
				const repoName = payload.repository.name;

				repos.forEach((config) => {
					const { git_hub_secret, git_hub_repo_name, git_hub_repo_url } = config;

					let sig = 'sha1=' + crypto.createHmac('sha1', git_hub_secret).update(body.toString()).digest('hex');

					if (req.headers['x-hub-signature'] == sig && git_hub_repo_name == repoName) {
						// console.log('Did you configure your github hooks?');
						// console.log(`${git_hub_repo_url}/settings/hooks/`);
						// console.log(`Your secret is:${git_hub_secret}`);
						// console.log(`-----------------------------------`);

						Shell.buildAndStart(config);
						res.end();
					}
				});
			});
		}).listen(this.port);
	}
};
