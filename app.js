const Promise = require("bluebird");
const Discord = require("discord.js");
const fs = Promise.promisifyAll(require("fs"));
const modulePath = `${__dirname}/modules`;
const client = new Discord.Client();
let commands = {};

async function loadModules(env) {
    let files = await fs.readdirAsync(modulePath);
    for (var i in files) {
        let file = files[i];
        console.log(`[INFO] Loading ${file}`)
        require(`${modulePath}/${file}`)(env);
    }
    
};

async function registerCommand(name,func) {
    console.log(`[INFO] Registering command ${name}`)
    commands[name] = func; 
}

async function init() {
    loadModules({
            client: client,
            registerCommand: registerCommand
        });
    client.on('message', msg => {
        console.log(msg.content);
        let parsed = {};
        parsed.msg = msg;
        let split = msg.content.split(" ");
        let cmd = split.shift();
        if (cmd.indexOf('!') != 0) {
            return;
        }
        cmd = cmd.slice(1,cmd.length);
        console.log(cmd);
        parsed.args = split;
        if (commands[cmd.toLowerCase()]) {
            console.log("command!");
            commands[cmd.toLowerCase()](parsed,client);
        }
    });
    console.log((await fs.readFileAsync(`${__dirname}/token`)).toString().replace(/\s/g, ''));
    await client.login((await fs.readFileAsync(`${__dirname}/token`)).toString().replace(/\s/g, ''));
    console.log(client.user.id);
    
}
init(); // dirty hack to make await work. TODO: Do it better.