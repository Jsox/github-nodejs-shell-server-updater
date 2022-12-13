const shell = require('shelljs');
const { dirname, resolve } = require('path');
const appDir = dirname(require.main.filename);
const fs = require('fs');

module.exports = class Shell {
	static cd(pathTo) {
		return shell.cd(resolve(appDir + pathTo));
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
	static requiredDirExists(pathTo) {
		const dir = resolve(appDir + pathTo);
		if (!fs.existsSync(dir)) {
			Shell.echo('Error: wrong site path (site_path_to_dir_where_cloned_code)');
			Shell.echo('Root dir:' + appDir);
			Shell.echo('Dir of cloned github:' + dir);
			Shell.exit();
		} else {
			Shell.echo('Dir exists:' + dir);
		}
	}
	static isDirExists(pathTo) {
		const dir = resolve(appDir, pathTo);
		return fs.existsSync(dir);
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

		const pathToClone = site_path_to_dir_where_cloned_code + '/' + git_hub_repo_name;

		Shell.requiredDirExists(pathToClone);
		Shell.cd(pathToClone);

		Shell.requiredScript(node_packet_manager);
		Shell.requiredScript('pm2');

		shell.exec(`git checkout ${git_hub_branch_to_deploy}`);
		shell.exec(`git pull`);

		shell.echo(`installing: ${node_packet_manager} install`);
		shell.exec(`${node_packet_manager} install`);

		shell.echo(`building: ${node_packet_manager} ${node_build_command}`);
		shell.exec(`${node_packet_manager} ${node_build_command}`);

		shell.exec(`pm2 stop ${git_hub_repo_name} || true`);
		shell.exec(`pm2 delete ${git_hub_repo_name} || true`);

		const pm2start = `NODE_ENV=${node_environment} PORT=${site_port_to_deploy} pm2 --name ${git_hub_repo_name} start ${node_packet_manager} -- ${node_start_command}`;
		shell.echo(`starting pm2: ${pm2start}`);
		shell.exec(pm2start);

		shell.exec('pm2 save');

		console.log(`(Just helper, ignore it or not) Config for your site in nginx:`);
		console.log(`
location / {
    proxy_set_header Connection '';
    proxy_read_timeout 180s;
    proxy_set_header Host $host;
    proxy_buffering off;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:${site_port_to_deploy};
}
`);
	}
};
