const fblueprint = require("factorio-blueprint");
const Discord = require('discord.js');
var rp = require('request-promise');

module.exports = (env) => {
    env.registerCommand('binfo', async(msg) => {
        let out = '```';
        let blueprint;
        try {
            console.log(msg.args[0]);
            blueprint = new fblueprint();
            blueprint.load(msg.args[0].replace(/\s/g, ''));
        }
        catch (e) {
            console.log(e);
            return;
        }
        let entities = blueprint.entities;
        let counts = {};
        for (var i in entities) {
            if (!counts[entities[i].name]) {
                counts[entities[i].name] = 0;
            }
            counts[entities[i].name] += 1;
        }
        for (var i in counts) {
            out += `${i} x${counts[i]}\n`;
        }
        out += '```';
        const embed = new Discord.RichEmbed();
        embed.setDescription("Information about the blueprint");
        console.log(blueprint.icons);
        embed.addField('Icons', blueprint.icons.toString());
        embed.addField('Components', out);
        msg.msg.channel.sendEmbed(embed);
    });
    env.client.on('message', async msg => {
        let split = msg.content.split("\n");
        let embed = new Discord.RichEmbed();
        for (var i in split) {
            let x = split[i].split(" ");
            if (x[0].toLowerCase() == 'linkmod:') {
                x.shift();
                console.log("Bing!");
                let name = encodeURIComponent(x.join(" "));
                let res = JSON.parse(await rp(`https://mods.factorio.com/api/mods?q=${name}&page_size=30&page=1&order=top`));
                embed.addField(res.results[0].title,
                `**Name**: ${res.results[0].title}
**Description**: ${res.results[0].summary}
**Owner**: ${res.results[0].owner}
**Homepage**: ${res.results[0].homepage}
**Versions Supported**: ${res.results[0].game_versions.toString()}`);
                console.log(res);
                
            }
        }
        if (msg.content.indexOf('linkmod:') != -1) {
            msg.channel.sendEmbed(embed);
        }
    });
};
