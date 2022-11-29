const shell = require('shelljs');

if (!shell.which('pm2')) {
    pm2Error();
}

shell.exec(`pm2 stop github-nodejs-shell-server-updater || true`);
shell.exec(`pm2 delete github-nodejs-shell-server-updater || true`);
shell.exec(`pm2 --name github-nodejs-shell-server-updater start yarn -- deploy`);
shell.exec(`pm2 save`);

function pm2Error() {
    shell.echo(`!!!Error: Sorry, this script requires "pm2"
        npm install pm2
        or
        yarn add pm2`);
    shell.exit(1);
}