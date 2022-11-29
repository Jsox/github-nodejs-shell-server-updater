const shell = require('shelljs');

module.exports = class Shell {
    static cd(path) {
        return shell.cd(path);
    }
    static exit() {
        return shell.exit(1);
    }
    static echo(str) {
        return shell.echo(str);
    }
    static exec(str) {
        return shell.exec(str);
    }
    static requiredDirExists(path) {
        if (shell.ls(path).length === 0) {
            Shell.echo('Error: wrong site path (site_path_to_dir_where_cloned_code)');
            Shell.exit();
        }
    }
    static isDirExists(path) {
        return shell.ls(path).length === 0 ? false : true;
    }
    static isInstalledScript(name) {
        return shell.which(name) ? true : false;
    }
    static requiredScript(name) {
        if (!shell.which(name)) {
            Shell.echo(`Error: Sorry, this script requires - "${name}"`);
            Shell.exit();
        }
    }
    static buildAndStart(config) {
        const {
            git_hub_branch_to_deploy,
            node_packet_manager,
            node_build_command,
            node_start_command,
            node_environment,
            site_port_to_deploy,
            git_hub_repo_name,
            site_path_to_dir_where_cloned_code,
        } = config;

        Shell.requiredDirExists(site_path_to_dir_where_cloned_code);
        Shell.cd(site_path_to_dir_where_cloned_code);

        Shell.requiredDirExists(git_hub_repo_name);
        Shell.cd(git_hub_repo_name);

        Shell.requiredScript(node_packet_manager);

        shell.exec(`git checkout ${git_hub_branch_to_deploy}`);
        shell.exec(`git pull`);
        shell.exec(`${node_packet_manager} install`);
        shell.exec(`${node_packet_manager} ${node_build_command}`);
        shell.exec(`pm2 stop ${git_hub_repo_name} || true`);
        shell.exec(`pm2 delete ${git_hub_repo_name} || true`);

        shell.exec(
            `NODE_ENV=${node_environment} PORT=${site_port_to_deploy} pm2 --name ${git_hub_repo_name} start ${node_packet_manager} -- ${node_start_command}`
        );

        shell.exec('pm2 save');
    }
};
