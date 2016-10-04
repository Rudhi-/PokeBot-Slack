/**
 * Created by Anirudha Simha
 */

var controller = require('./node_modules/botkit').slackbot({
    interactive_replies: true
});
/*
// set up a botkit app to expose oauth and webhook endpoints
controller.setupWebserver(8082, function (err, webserver) {

    // set up web endpoints for oauth, receiving webhooks, etc.
    controller
    //.createHomepageEndpoint(controller.webserver)
        .createOauthEndpoints(webserver, function (err, req, res) {

        });
    //.createWebhookEndpoints(controller.webserver);

});*/
var bot = controller.spawn({
    token: require("./properties.json").slack_token
}).startRTM();

var localtunnel = require('./node_modules/localtunnel');

var tunnel = localtunnel(8082, {"subdomain":"pokebot"+require("./properties.json").localtunnel_subdomain}, function (err, tunnel) {
    if (err) {
        console.log("ERROR: " + err);
    }
    // the assigned public url for your tunnel
    console.log(tunnel.url);
});

tunnel.on('close', function () {
    // tunnels are closed
    console.log("Tunnel closed!");
});

//the regex will only match pokemon names
controller.hears([/I choose you ([^0-9]+)/i, /go ([^0-9]+)/i], ['direct_message', 'direct_mention', 'mention', 'ambient'], function (bot, message) {
    var request = require("./node_modules/request");
    var pokemon = message.match[1].toLowerCase().trim();
    request("http://pokeapi.co/api/v2/pokemon/" + pokemon, function (error, response, body) {
        if (JSON.parse(body).detail != "Not found.") {
            bot.reply(message, {
                "username": "pokebot",
                "attachments": [
                    {
                        "title": pokemon,
                        "title_link": "http://sprites.pokecheck.org/i/" + pad(Number(JSON.parse(body).id), 3) + ".gif",
                        "image_url": "http://sprites.pokecheck.org/i/" + pad(Number(JSON.parse(body).id), 3) + ".gif"
                    }
                ]
            });
        }
        else {
            bot.reply(message, "Pokemon not found! Did you type its name correctly?");
        }
    });
});

controller.hears([/hello/i], ['direct_message', 'direct_mention', 'mention', 'ambient'], function (bot, message) {
    bot.reply(message, "Hello I'm pokebot!\n" +
        "Type _I choose you_ or _go_ followed by a pokemon's name to summon a pokemon!\n" +
        "Or if you wish to fight me than type _battle_ in a direct message to me!");
});

controller.hears([/battle/i], ['direct_message'], function (bot, message) {
    require('./hears/battle.js').startBattle(bot, message);
});

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}