/**
 * Created by Anirudha Simha.
 * Still under development
 */
// 0only works against pokebot
module.exports = {
    startBattle: function (bot, message) {
        //var challangeThem = false;
        //var challanged = "";
        //var challanger = "";
        var playerTeam = {};
        var cpuTeam = {};

        bot.startConversation(message, function (err, convo) {
            convo.ask({
                    attachments: [
                    {
                        title: 'Are you sure you wish to battle?',
                        callback_id: '123',
                        attachment_type: 'default',
                        actions: [
                            {
                                "name": "yes",
                                "text": "Yes",
                                "value": "yes",
                                "type": "button"
                            },
                            {
                                "name": "no",
                                "text": "No",
                                "value": "no",
                                "type": "button"
                            }
                        ]
                    }
                ]
                },[
                    {
                        pattern: "yes",
                        callback: function (response, convo) {
                            //convo.say("Solid! Let us battle!");
                            //console.log("GETTING POKEMON!");
                            bot.reply(message, "Ok hold on getting your pokemon! (This may take a minute or so)");
                            getPokemon(function (result) {
                                playerTeam = result;
                                //console.log(playerTeam);
                                bot.reply(message, "Here are your pokemon!!");
                                bot.reply(message, JSON.stringify(playerTeam, null, 4));
                                bot.reply(message, "Generating opponent's team!! (This may take a minute or so)");
                                getPokemon(function (result) {
                                    bot.reply(message, "_Solid Let's fight!!_");
                                    cpuTeam = result;
                                    battleStart(bot, message, playerTeam, cpuTeam, function () {
                                        convo.next();
                                    });

                                });

                            });
                        }
                    },
                    {
                        pattern: "no",
                        callback: function (response, convo) {
                            convo.say("Alright no problem then!");
                            convo.next();
                        }
                    },
                    {
                        default: true,
                        callback: function (response, convo) {
                            // just repeat the question
                            convo.repeat();
                            convo.next();
                        }
                    }
                ]);
            //convo.next();
        });

    }

};

/*
 function teamSelector(cb){
 var async = require('../node_modules/async');
 var team = {};
 team.pokemon = [];
 var request = require("../node_modules/request");
 async.parallel([
 getPokemon(team,0,function(){
 console.log(JSON.stringify(team.pokemon[0],null,4));
 }),
 getPokemon(team,1,function(){
 console.log(JSON.stringify(team.pokemon[1],null,4));
 }),
 getPokemon(team,2,function(){
 console.log(JSON.stringify(team.pokemon[2],null,4));
 }),
 getPokemon(team,3,function(){
 console.log(JSON.stringify(team.pokemon[3],null,4));
 }),
 getPokemon(team,4,function(){
 console.log(JSON.stringify(team.pokemon[4],null,4));
 }),
 getPokemon(team,5,function(){
 console.log(JSON.stringify(team.pokemon[5],null,4));
 })
 ],function(err){
 console.log(JSON.stringify(team,null,4));
 })
 }
 */

function battleStart(bot, message, playerTeam, cpuTeam, callback) {
    bot.reply(message, "In func _battleStart_!");
    bot.reply(message, "Your move");


    if (callback) {
        callback();
    }
}
function getPokemon(callback) {
    var team = {};
    team.pokemon = [];
    team.items = [];
    var request = require('../node_modules/request');

    // Getting pokemon 1
    var id = pad(Math.floor(Math.random() * 650), 3);
    request("http://pokeapi.co/api/v2/pokemon/" + id, function (error, response, body) {
        console.log(JSON.parse(body).name);
        team.pokemon[0] = {};
        team.pokemon[0].name = JSON.parse(body).name;
        // getting all of the stats for the pokemon
        for (var j = 0; j < JSON.parse(body).stats.length; j++) {
            team.pokemon[0][JSON.parse(body).stats[j].stat.name] = JSON.parse(body).stats[j].base_stat;
        }
        // Getting pokemon 2
        id = pad(Math.floor(Math.random() * 650), 3);

        request("http://pokeapi.co/api/v2/pokemon/" + id, function (error, response, body) {
            console.log(JSON.parse(body).name);
            team.pokemon[1] = {};
            team.pokemon[1].name = JSON.parse(body).name;
            // getting all of the stats for the pokemon
            for (var j = 0; j < JSON.parse(body).stats.length; j++) {
                team.pokemon[1][JSON.parse(body).stats[j].stat.name] = JSON.parse(body).stats[j].base_stat;
            }

            // Getting pokemon 3
            id = pad(Math.floor(Math.random() * 650), 3);

            request("http://pokeapi.co/api/v2/pokemon/" + id, function (error, response, body) {
                console.log(JSON.parse(body).name);
                team.pokemon[2] = {};
                team.pokemon[2].name = JSON.parse(body).name;
                // getting all of the stats for the pokemon
                for (var j = 0; j < JSON.parse(body).stats.length; j++) {
                    team.pokemon[2][JSON.parse(body).stats[j].stat.name] = JSON.parse(body).stats[j].base_stat;
                }

                // pokemon 4
                id = pad(Math.floor(Math.random() * 650), 3);
                request("http://pokeapi.co/api/v2/pokemon/" + id, function (error, response, body) {
                    console.log(JSON.parse(body).name);
                    team.pokemon[3] = {};
                    team.pokemon[3].name = JSON.parse(body).name;
                    // getting all of the stats for the pokemon
                    for (var j = 0; j < JSON.parse(body).stats.length; j++) {
                        team.pokemon[3][JSON.parse(body).stats[j].stat.name] = JSON.parse(body).stats[j].base_stat;
                    }

                    // pokemon 5
                    id = pad(Math.floor(Math.random() * 650), 3);
                    request("http://pokeapi.co/api/v2/pokemon/" + id, function (error, response, body) {
                        console.log(JSON.parse(body).name);
                        team.pokemon[4] = {};
                        team.pokemon[4].name = JSON.parse(body).name;
                        // getting all of the stats for the pokemon
                        for (var j = 0; j < JSON.parse(body).stats.length; j++) {
                            team.pokemon[4][JSON.parse(body).stats[j].stat.name] = JSON.parse(body).stats[j].base_stat;
                        }

                        // pokemon 6
                        id = pad(Math.floor(Math.random() * 650), 3);
                        request("http://pokeapi.co/api/v2/pokemon/" + id, function (error, response, body) {
                            console.log(JSON.parse(body).name);
                            team.pokemon[5] = {};
                            team.pokemon[5].name = JSON.parse(body).name;
                            // getting all of the stats for the pokemon
                            for (var j = 0; j < JSON.parse(body).stats.length; j++) {
                                team.pokemon[5][JSON.parse(body).stats[j].stat.name] = JSON.parse(body).stats[j].base_stat;
                            }
                            //var err = null;
                            var result = team;
                            //console.log("DONE");
                            //console.log(JSON.stringify(team,null,4));
                            if (callback) {
                                return callback(result);
                            }
                        });
                    });
                });
            });
        });


    });

}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
/*
 function(response,convo){
 challanger = message.user;
 challanged = (response.text+"").trim().toLowerCase();
 convo.say("Asking "+challanged+" if they would like to battle!");
 bot.api.users.list({
 "presence":"1"
 }, function(err, res) {
 if (err) {
 convo.say('Failed to find user :(');
 }
 else{
 bot.say({
 "text":"You have been challanged, to accept this type battle accepted in a direct message with your challanger "+challanger,
 "channel":"@"+challanged
 })
 }
 });
 convo.next();

 }*/