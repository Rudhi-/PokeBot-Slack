/**
 * Created by Anirudha Simha.
 * Still under development
 */
module.exports={
    battle : function(bot, message){
        bot.startConversation(message,function(err,convo){
            convo.ask("who would you like to battle?",function(response,convo){
                convo.say("Asking "+response.text+" if they would like to battle!");
                bot.api.users.list({
                    "presence":"1"
                }, function(err, res) {
                    if (err) {
                       convo.say('Failed to find user :(');
                    }
                    else{
                        //onvo.say(JSON.stringify(res,null,4));
                        for(var i = 0; i < res.members.length;i++){
                            //if(res.members[i])
                        }
                    }
                });
                convo.next();
            });
        });
    }
}
