require('dotenv').config();

// constants
const stacks = ['frontend', 'backend'];
const levels = ['info', 'warn', 'error', 'debug', 'fatal'];
const packages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service', 'api', 'component', 'hook', 'page', 'style', 'state', 'auth', 'config', 'middleware', 'utils'];

export async function log({stack, level, pkg, message}) {
    // validate input
    if(!stacks.includes(stack) || !levels.includes(level) || !packages.includes(pkg)) {
        return;
    }
    const body =  stack + ' ' + level + ' ' + pkg + ' ' + message;
    try{
        // send log
        const res = await fetch(process.env.LOG_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
            },
            body
        });
        return res;
    }
    catch(e){
        // log error
        console.log(e);
    }
}