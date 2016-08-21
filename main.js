/**
 * Created by Anirudha Simha
 */

var Botkit = require('./node_modules/botkit');
var controller = Botkit.slackbot({
    debug: false
});
var bot = controller.spawn({
    token: require("./properties.json").slack_token
}).startRTM();

//the regex will only match pokemon names
controller.hears([/I choose you ([^0-9]+)/i,/go ([^0-9]+)/i ], ['direct_message', 'direct_mention', 'mention','ambient'], function(bot, message) {

    var request = require("request");
    var pokemon = message.match[1].toLowerCase().trim();
    request("http://pokeapi.co/api/v2/pokemon/"+pokemon, function(error, response, body) {
        console.log(JSON.stringify(JSON.parse(body),null,4))
        bot.reply(message,{
            "username":"pokebot",
            "attachments": [
                {
                    "title": pokemon,
                    "title_link": "http://sprites.pokecheck.org/i/"+pad(new Number(JSON.parse(body).id),3)+".gif",
                    "image_url": "http://sprites.pokecheck.org/i/"+pad(new Number(JSON.parse(body).id),3)+".gif"
                }
            ]
        })
    });

});

controller.hears([/hello/i],['direct_message', 'direct_mention', 'mention','ambient'],function(bot,message){
    //require('./hears/battle').battle(bot,message);
    bot.reply(message,"Hello I'm pokebot!\n Type _I choose you_ or _go_ followed by a pokemon's name to summon a pokemon!");
});


function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}