const DeployFromGithubAndListenForUpdates = require('./start');

const reposConfig = [
    {
        git_hub_repo_name: 'daisyui-astro',
        git_hub_repo_url: 'https://github.com/Jsox/daisyui-astro.git',
        git_hub_secret: 'qwerty',
        git_hub_branch_to_deploy: 'main',
        site_path_to_dir_where_cloned_code: './', //относительно этого файла или абсолютный путь (директория в которой будет или есть клонированная директория репозитория)
        site_port_to_deploy: '3150',
        node_packet_manager: 'yarn',
        node_build_command: 'build',
        node_environment: 'production',
        node_start_command: 'preview',
    },
];

new DeployFromGithubAndListenForUpdates(reposConfig);
