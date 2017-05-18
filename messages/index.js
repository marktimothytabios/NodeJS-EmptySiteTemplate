/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var getUserRequest = require('./dialogs/getUserRequest').GetUserRequest();
// var useEmulator = (process.env.NODE_ENV == 'development');
var useEmulator = true;

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var jira = "JIRA",
    confluence = "Confluence",
    planView = "PlanView",
    svn = "SVN",
    git = "Git";

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector);

// root dialog
bot.dialog('/', [
    (session) => {
        session.sendTyping();
        setTimeout(function() {
            session.beginDialog('/getUserRequest');
        }, 1000);
    }
]);


// getUserRequest
bot.dialog('/getUserRequest', [
    (session) => {
        session.sendTyping();
        setTimeout(function() {
            builder.Prompts.text(session, "Hi User, What can I do for you. Say 'options' to see.");
        }, 1000);
    },
    (session, results) => {
        var response = "" + results.response;
        if (response.match(/^(show|option)/i)) {
            session.beginDialog('/showOptions');
        } else {
            session.endDialog();
        }
    }
]);


// show Options dialog.
bot.dialog('/showOptions', [
    function (session) {
        session.sendTyping();
        setTimeout(() => {
            var msg = new builder.Message(session);
            msg.attachmentLayout(builder.AttachmentLayout.carousel)
            msg.attachments([
                new builder.HeroCard(session)
                    .title("JIRA")
                    .images([builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/en/b/bf/JIRA_logo.svg')])
                    .buttons([
                        builder.CardAction.imBack(session, jira, "Get Started")
                    ]),
                new builder.HeroCard(session)
                    .title("Confluence")
                    .images([builder.CardImage.create(session, 'https://wac-cdn-a.atlassian.com/dam/jcr:a22c9f02-b225-4e34-9f1d-e5ac0265e543/confluence_rgb_slate.png?cdnVersion=ek')])
                    .buttons([
                        builder.CardAction.imBack(session, confluence, "Get Started")
                    ]),
                new builder.HeroCard(session)
                    .title("SVN")
                    .images([builder.CardImage.create(session, 'http://3.bp.blogspot.com/-kTWEQjlwVTY/VrHAziSEu7I/AAAAAAAAAQA/xc8-DBcjFuA/s1600/svn-www.hackthesec.co.in.jpg')])
                    .buttons([
                        builder.CardAction.imBack(session, svn, "Get Started")
                    ]),
                new builder.HeroCard(session)
                    .title("Planview")
                    .images([builder.CardImage.create(session, 'http://mms.businesswire.com/bwapps/mediaserver/ViewMedia?mgid=119795&vid=5&download=1')])
                    .buttons([
                        builder.CardAction.imBack(session, planView, "Get Started")
                    ]),
                new builder.HeroCard(session)
                    .title("GIT")
                    .images([builder.CardImage.create(session, 'http://valuebound.com/sites/default/files/2015-12/Beginners_guide_setting_up-git.jpg')])
                    .buttons([
                        builder.CardAction.imBack(session, git, "Get Started")
                    ])
            ]);
            builder.Prompts.text(session, msg);
        }, 2000);
    },
    function(session, results) {
        console.log("in here" + session.message.text + " results " + results.response);
        switch(results.response) {
            case jira:
                session.beginDialog('/' + jira);
                break;
            case git:
                session.beginDialog('/' + git);
                break;
            case svn:
                session.beginDialog('/' + svn);
                break;
            case confluence:
                session.beginDialog('/' + confluence);
                break;
            case planView:
                session.beginDialog('/' + planView);
                break;
            default:
                session.send("Options not available..").endDialog();
                break;
        }
    }
]);

// JIRA dialog
bot.dialog('/JIRA', [
    (session) => {
        session.sendTyping();
        console.log('inside jira');
        session.endDialog();
    }
    
]);

// Confluence dialog
bot.dialog('/Confluence', [
    (session) => {
        session.sendTyping();
        console.log('inside con');
        session.endDialog();
    }
]);

// SVN dialog
bot.dialog('/SVN', [
    (session) => {
        session.sendTyping();
        console.log('inside svn');
        session.endDialog();
    }
]);

// Planview
bot.dialog('/Planview', [
    (session) => {
        session.sendTyping();
        console.log('inside plan');
        session.endDialog();
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
