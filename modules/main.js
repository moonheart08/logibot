module.exports = (env) => {
    env.registerCommand('ping',(msg)=>{
        msg.msg.reply("Pong!");
    });
};