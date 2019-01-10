/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const RIDDLES = require("./riddle_objects");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = "Welcome to Level Up Riddles! "
        + "I will give you 5 riddles. Would you like to start with easy, medium, or hard riddles?";
    
    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Level Up Riddles', speechText)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: require('./homepage.json'),
          datasources: {
            "levelUpData": {
                "type": "object",
                "properties": {
                    "hintString": "easy, medium or hard",
                    "currentQuestionSsml": "<speak></speak>",
                    "currentLevel": "",
                    "currentQuestionNumber": "",
                    "numCorrect": ""
                },
                "transformers": [
                    {
                        "inputPath": "currentQuestionSsml",
                        "outputName": "currentQuestionSpeech",
                        "transformer": "ssmlToSpeech"
                    },
                    {
                        "inputPath": "currentQuestionSsml",
                        "outputName": "currentQuestionText",
                        "transformer": "ssmlToText"
                    },
                    {
                        "inputPath": "hintString",
                        "transformer": "textToHint"
                    }
                ]
            }
        }
      })
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Level Up Riddles', speechText)
      .getResponse();
  },
};

const PlayGameIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlayGameIntent'
      || handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    if (request.type === 'Alexa.Presentation.APL.UserEvent') {
      if (request.arguments[0] === 'easy') {
        sessionAttributes.currentLevel = "easy"
      } else if (request.arguments[0] === 'med') {
        sessionAttributes.currentLevel = "medium"
      } else {
        sessionAttributes.currentLevel = "hard"
      }
    } else {
      const spokenLevel = request.intent.slots.level.value;
      if (spokenLevel) {
        sessionAttributes.currentLevel = spokenLevel;
      }
    }

    sessionAttributes.currentIndex = 0;
    sessionAttributes.speechText = "Lets play with " 
        + sessionAttributes.currentLevel + " riddles! ";

    sessionAttributes.currentRiddle = RIDDLES.LEVELS[sessionAttributes.currentLevel][sessionAttributes.currentIndex];
    sessionAttributes.correctCount = 0;

    sessionAttributes.speechText += " First riddle: " + sessionAttributes.currentRiddle.question;

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(sessionAttributes.speechText)
        .reprompt(sessionAttributes.speechText)
        .withSimpleCard('Level Up Riddles', sessionAttributes.speechText)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speechText)
      .reprompt(sessionAttributes.speechText)
      .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          datasources: {
              "levelUpData": {
                  "type": "object",
                  "properties": {
                      "hintString": "easy, medium or hard",
                      "currentQuestionSsml": "<speak>"+sessionAttributes.currentRiddle.question+"</speak>",
                      "currentLevel": sessionAttributes.currentLevel,
                      "currentQuestionNumber": (sessionAttributes.currentIndex + 1),
                      "numCorrect": sessionAttributes.correctCount
                  },
                  "transformers": [
                      {
                          "inputPath": "currentQuestionSsml",
                          "outputName": "currentQuestionSpeech",
                          "transformer": "ssmlToSpeech"
                      },
                      {
                          "inputPath": "currentQuestionSsml",
                          "outputName": "currentQuestionText",
                          "transformer": "ssmlToText"
                      },
                      {
                          "inputPath": "hintString",
                          "transformer": "textToHint"
                      }
                  ]
              }
          },
          document: require('./question.json'),
      })
      .withSimpleCard('Level Up Riddles', sessionAttributes.speechText)
      .getResponse();
  }
};

const AnswerRiddleIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AnswerRiddleIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    console.log(JSON.stringify(handlerInput.requestEnvelope.request.intent.slots));
    const spokenAnswer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
    sessionAttributes.speechText = "";
    if (spokenAnswer == sessionAttributes.currentRiddle.answer) {
      sessionAttributes.speechText += sessionAttributes.currentRiddle.answer + " is correct! You got it right! "
      sessionAttributes.correctCount += 1;
      sessionAttributes.correct = "Correct! ";
    } else {
      sessionAttributes.speechText += "Oops, that was wrong. The correct answer is " + sessionAttributes.currentRiddle.answer + ". ";
      sessionAttributes.correct = "Incorrect! ";
    }

    sessionAttributes.currentIndex += 1;

    if (sessionAttributes.currentIndex == RIDDLES.LEVELS[sessionAttributes.currentLevel].length) {
      sessionAttributes.speechText +=
          "You have completed all of the riddles on this level! "
          + "Your correct answer count is "
          + sessionAttributes.correctCount
          + ". To play another level, say easy, medium, or hard. ";
      sessionAttributes.currentLevel = "";
      sessionAttributes.currentRiddle = {};

      if (supportsAPL(handlerInput)) {
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            datasources: {            
              "levelUpData": {
                    "type": "object",
                    "properties": {
                        "hintString": "easy, medium or hard",
                        "currentQuestionSsml": "<speak>"+sessionAttributes.currentRiddle.question+"</speak>",
                        "currentLevel": sessionAttributes.currentLevel,
                        "currentQuestionNumber": (sessionAttributes.currentIndex + 1),
                        "numCorrect": sessionAttributes.correctCount
                    },
                    "transformers": [
                        {
                            "inputPath": "currentQuestionSsml",
                            "outputName": "currentQuestionSpeech",
                            "transformer": "ssmlToSpeech"
                        },
                        {
                            "inputPath": "currentQuestionSsml",
                            "outputName": "currentQuestionText",
                            "transformer": "ssmlToText"
                        },
                        {
                            "inputPath": "hintString",
                            "transformer": "textToHint"
                        }
                    ]
                }
            },
            document: require('./finishedquestions.json')
        });
      }

      sessionAttributes.currentIndex = 0;
    } else {
      sessionAttributes.currentRiddle = RIDDLES.LEVELS[sessionAttributes.currentLevel][sessionAttributes.currentIndex];
      sessionAttributes.speechText += "Next riddle: " + sessionAttributes.currentRiddle.question;

      if (supportsAPL(handlerInput)) {
        handlerInput.responseBuilder.addDirective({
            type : 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            datasources: {
                "levelUpData": {
                    "type": "object",
                    "properties": {
                        "hintString": "easy, medium or hard",
                        "currentQuestionSsml": "<speak>"+sessionAttributes.currentRiddle.question+"</speak>",
                        "currentLevel": sessionAttributes.currentLevel,
                        "currentQuestionNumber": (sessionAttributes.currentIndex + 1),
                        "numCorrect": sessionAttributes.correctCount
                    },
                    "transformers": [
                        {
                            "inputPath": "currentQuestionSsml",
                            "outputName": "currentQuestionSpeech",
                            "transformer": "ssmlToSpeech"
                        },
                        {
                            "inputPath": "currentQuestionSsml",
                            "outputName": "currentQuestionText",
                            "transformer": "ssmlToText"
                        },
                        {
                            "inputPath": "hintString",
                            "transformer": "textToHint"
                        }
                    ]
                }
            },
            document: require('./question.json')
        });
      }
    }

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    return handlerInput.responseBuilder
      .speak(sessionAttributes.speechText)
      .reprompt(sessionAttributes.speechText)
      .withSimpleCard('Level Up Riddles', sessionAttributes.speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = "I will give you 5 riddles. Would you like to start with easy, medium, or hard riddles?"

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Level Up Riddles', speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Level Up Riddles', speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    console.log("Error in request "  + JSON.stringify(handlerInput.requestEnvelope.request));

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  }
};

function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface != null && aplInterface != undefined;
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayGameIntentHandler,
    AnswerRiddleIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .withApiClient(new Alexa.DefaultApiClient())
  .addErrorHandlers(ErrorHandler)
  .lambda();




