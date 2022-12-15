# Описание работы скрипта

## Зачем?

Данный скрипт предназначен для автоматического развертывания и запуска **nodejs** приложений на сервере из репозиториев **GitHub** с последующим автоматическим обновлением кода на сервере при **push** на GitHub и автоматическим перезапуском приложения на сервере.

### То есть, как это выглядит:

-   У Вас есть репозиторий на GitHub
-   Скрипт разворачивает приложение на сервере
-   При обновлении кода в репозитории (push), код **автоматически** обновляется на сервере
-   После чего скрипт **автоматически** _билдит_ и _запускает_ приложение на сервере с помощью **pm2**

## Инструкции

#### Для начала нужен домен или адрес на домене для этих целей

За пример возьмем домен deployer.site.com (или site.com/deployer)

-   в корне запускаем `yarn init`
-   указываем главный скрипт `main` как `index.js`
-   инсталлируем `yarn add github-nodejs-shell-server-updater`
-   создаем `index.js`
-   в нем пишем код, конечно с Вашими настройками

```javascript
const Deployer = require('github-nodejs-shell-server-updater');

const config = [
    {
        git_hub_repo_name: 'repo-name',
        git_hub_repo_url: 'https://github.com/User/repo-name',
        git_hub_secret: 'your-secret-string-for-github-updates',
        git_hub_branch_to_deploy: 'main',
        site_path_to_dir_where_cloned_code: '/../site.com', //относительно этого файла (директория в которой будет или есть клонированная директория репозитория, слэш в начале обязателен)
        site_port_to_deploy: '3000', //just Node variable PORT=3000
        node_packet_manager: 'yarn',
        node_build_command: 'build',
        node_start_command: 'start',
        node_environment: 'production', //just Node variable NODE_ENV=production
    },
];

new Deployer(config, 6768);
```

-   затем запускаем скрипт `node ./index.js`
-   при первом запуске:

    1. скрипт перейдет в директорию сайта
    2. клонирует репозиторий в директорию **repo-name** (git_hub_repo_name)
    3. выполнит команду **build** из конфига (node_build_command)
    4. с помощью **pm2** выполнит команду **start** из конфига (node_start_command)
    5. выполнит команду **pm2 save**
    6. запустит сервер на порту 6768 (второй аргумент конструктора класса) для прослушивания уведомлений (github hook)
    7. конечно, Вам нужно настроить конфигурацию `deployer.site.com`, если у Вас `nginx`, то она будет выглядеть примерно так:

    ```shell
    location / {
        proxy_set_header Connection '';
        proxy_read_timeout 180s;

        proxy_set_header Host $host;
        proxy_buffering off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:6768;
    }
    ```

-   теперь нужно настроить GitHub
    1. Идем в настройки репозитория **repo-name** https://github.com/User/repo-name/settings
    2. В настройках видим **Webhooks**
    3. Добавляем **hook** с **Payload URL** `deployer.site.com` и `Secret` из конфига **git_hub_secret**

Теперь, когда Вы запушите обновление, например, с локального компа, в этот репозиторий, GitHub отправит уведомление на deployer.site.com, а скрипт обновит код и перезапустит приложение на сервере.
