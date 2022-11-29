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

            if (Shell.isDirExists(git_hub_repo_name)) {
                Shell.echo('!!! git cloning');
                Shell.exec(`git clone -b ${git_hub_branch_to_deploy} ${git_hub_repo_url}`);

                Shell.requiredDirExists(git_hub_repo_name);
                Shell.cd(git_hub_repo_name);

                Shell.buildAndStart(config);
            }
        });
    }
};
