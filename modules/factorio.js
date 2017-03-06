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
                if (!res) {
                    break;
                }
                console.log(res.results[0]);
                embed.addField(res.results[0].title,
                    `**Description**: ${res.results[0].summary}
**Owner**: ${res.results[0].owner}
**Mod Page**: https://mods.factorio.com/mods/${res.results[0].owner}/${res.results[0].name}
**Versions Supported**: ${res.results[0].latest_release.info_json.factorio_version}`);

            }
            else if (x[0].toLowerCase().indexOf('linkmod:') != -1 && !isNaN(parseInt(x[0].toLowerCase()))) {
                let count = parseInt(x[0].toLowerCase());
                if (count > 5) {
                    msg.reply("I refuse to do more than 5 mods.");
                }
                else {
                    x.shift();
                    let name = encodeURIComponent(x.join(" "));
                    let res = JSON.parse(await rp(`https://mods.factorio.com/api/mods?q=${name}&page_size=30&page=1&order=top`));
                    if (!res) {
                        msg.reply("No results!");
                        break;
                    }
                    for (var j in res.results) {
                        if (!res.results[j]) {
                            msg.reply("ERROR!");
                        }
                        if (j > count-1) {
                            break;
                        }
                        embed.addField(res.results[j].title,
                            `**Description**: ${res.results[j].summary}
**Owner**: ${res.results[j].owner}
**Mod Page**: https://mods.factorio.com/mods/${res.results[j].owner}/${res.results[j].name}
**Versions Supported**: ${res.results[j].latest_release.info_json.factorio_version}`);
                    }
                }

            }
        }
        if (msg.content.toLowerCase().indexOf('linkmod:') != -1 && embed.fields.length != 0) {
            console.log("done");
            msg.channel.sendEmbed(embed);
        }
    });
};
