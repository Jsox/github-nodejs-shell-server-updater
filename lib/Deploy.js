const Shell = require('./Shell');

module.exports = class Deploy {
	repos = [];

	constructor(repos) {
		Shell.requiredScript('pm2');
		this.repos = repos;
		this.start();
	}

	start() {
		this.repos.map((config) => {
			const {
				site_path_to_dir_where_cloned_code,
				git_hub_repo_name,
				git_hub_branch_to_deploy,
				git_hub_repo_url,
			} = config;

			Shell.requiredDirExists(site_path_to_dir_where_cloned_code);

			Shell.cd(site_path_to_dir_where_cloned_code);

			const pathToClone = site_path_to_dir_where_cloned_code + '/' + git_hub_repo_name;

			if (!Shell.isDirExists(pathToClone)) {
				Shell.echo('!!! git cloning');
				Shell.exec(`git clone -b ${git_hub_branch_to_deploy} ${git_hub_repo_url}`);

				Shell.buildAndStart(config);
			} else {
				Shell.echo('Error: dir exists. Not cloning');
				process.exit();
			}
		});
	}
};
