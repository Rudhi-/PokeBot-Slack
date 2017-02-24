/**
 * Created by Anirudha Simha
 */

var controller = require('./node_modules/botkit').slackbot({
    interactive_replies: true
   //
});

controller.configureSlackApp({
    clientId : require("./properties.json").client_id,
    clientSecret : require("./properties.json").client_secret,
    redirectUri: 'http://localhost:3002',
    scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

// set up a botkit app to expose oauth and webhook endpoints
controller.setupWebserver(8082,function(err,webserver) {

    // set up web endpoints for oauth, receiving webhooks, etc.
    controller
        .createHomepageEndpoint(controller.webserver)
        .createOauthEndpoints(controller.webserver,function(err,req,res) { })
        .createWebhookEndpoints(controller.webserver);

});
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
controller.hears([/I choose you ([a-z]+)/i, /go ([a-z]+)/i], ['direct_message', 'direct_mention', 'mention', 'ambient'], function (bot, message) {
    var request = require("./node_modules/request");
    var pokemon = message.match[1].toLowerCase().trim();
    // Check to see if link exists if not give error
    var url = "http://www.pokestadium.com/sprites/xy/"+pokemon+".gif";
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            bot.reply(message, {
                "username": "pokebot",
                "attachments": [
                    {
                        "title": pokemon,
                        "title_link":url,
                        "image_url":url
                    }
                ]
            });
        }
        else{
            bot.reply(message, "Pokemon not found! Did you type its name correctly?");
        }
    });



});

controller.hears([/hello/i], ['direct_message', 'direct_mention', 'mention', 'ambient'], function (bot, message) {
    bot.reply(message, "Hello I'm pokebot!\n" +
        "Type _I choose you_ or _go_ followed by a pokemon's name to summon a pokemon!\n" +
        "Or if you wish to fight me than type _battle_ in a direct message to me!");
});
controller.hears('interactive', 'direct_message', function(bot, message) {

    bot.reply(message, {
        attachments:[
            {
                title: 'Do you want to interact with my buttons?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"yes",
                        "text": "Yes",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                        "name":"no",
                        "text": "No",
                        "value": "no",
                        "type": "button",
                    }
                ]
            }
        ]
    });
});
controller.hears([/battle/i], ['direct_message'], function (bot, message) {
    require('./hears/battle.js').startBattle(bot, message);
});

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}