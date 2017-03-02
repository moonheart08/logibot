module.exports = (env) => {
    env.registerCommand('ping',(msg)=>{
        msg.reply("Pong!");
    });
};