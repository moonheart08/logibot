const mee = require("math-expression-evaluator");
module.exports = (env) => {
    env.registerCommand('math',(msg)=>{
        try {
            msg.msg.reply(mee.eval(msg.args.join(" ")));
        } catch (e) {
            msg.msg.reply(e.message);
        }
    });
};