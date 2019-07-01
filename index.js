// Created by Edmond Tsoi
// AI Chatbot developed using BootBot Javascript framework @2019
// https://github.com/Charca/bootbot

'use strict';
  // Chatbot
  const BootBot = require('bootbot');
  const bot = new BootBot({
      accessToken: 'EAAGalcf1NI4BADbCWmaWh6frZAXh5iG0HIu47gvfJNB3OZCFl0PKR5oBrBsqVEnsRfuJitzAlGjuzOevInpw2ZA79Buojf8QV3FQuoUmhSPNkR1VQDuLLJZCYwM8ATAMLgsEdxFX9oNwNyxCOrCt9Vk1vgAjD5Obnyt8RIjoEwkA8FRIZASGo',
      verifyToken: 'abc-cba-123',
      appSecret: '5b34ef02703b7acfcac15047255ebd65'
    });
  
  
  bot.hear(['hello', 'hi', /hey( there)?/i], (payload, chat) => {
    // Send a text message followed by another text message that contains a typing indicator
    chat.say('Hello, my friend!', { typing: 2000 }).then(() => {
      chat.say('How are you today?', { typing: 3000 });
    });
  });

  // Generic hungry testing
  bot.hear(['food', 'hungry'], (payload, chat) => {
    // Send a text message with quick replies
    chat.say({
      text: 'What do you want to eat today?',
      quickReplies: ['Mexican', 'Italian', 'American', 'Argentine']
    });
  });


  // Help
  bot.hear(['help'], (payload, chat) => {
    // Send a text message with buttons
    chat.say({
      text: 'What do you need help with?',
      buttons: [
        { type: 'postback', title: 'Settings', payload: 'HELP_SETTINGS' },
        { type: 'postback', title: 'FAQ', payload: 'HELP_FAQ' },
        { type: 'postback', title: 'Talk to a human', payload: 'HELP_HUMAN' }
      ]
    });
  });

  // Conversation 
  bot.hear('ask me something', (payload, chat) => {

    const askName = (convo) => {
      convo.ask(`What's your name?`, (payload, convo) => {
        const text = payload.message.text;
        convo.set('name', text);
        convo.say(`Oh, ok ${text}`).then(() => askFavoriteFood(convo));
      });
    };
  
    const askFavoriteFood = (convo) => {
      convo.ask(`What's your favorite food?`, (payload, convo) => {
        const text = payload.message.text;
        convo.set('food', text);
        convo.say(`Got it, I love ${text} too!`).then(() => sendSummary(convo));
      });
    };
  
    const sendSummary = (convo) => {
      convo.say(`alright, it was nice to meet you!`);
          // - Name: ${convo.get('name')}
          // - Favorite Food: ${convo.get('food')}`);
        convo.end();
    };
  
    chat.conversation((convo) => {
      askName(convo);
    });
  });

  // default to port 3000
  bot.start();


// --------------------------------------------  WEBHOOK --------------------------------------------  


// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
    let body = req.body;
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  });


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Customized random token
    let VERIFY_TOKEN = "abc-cba-123";
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });


