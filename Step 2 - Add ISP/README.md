# Add In-Skill Purchasing

In this section of the workshop, you will incorporate in-skill purchasing (ISP) into your skill. When developers and content creators build delightful skills with compelling content, customers win. With in-skill purchasing, you can sell premium content to enrich your Alexa skill experience.

When a customer plays through your Riddle Game, they have the option to purchase the ability to ask for a hint. When the customer successfully completes the in-skill purchase, they can ask for up to three hints per riddle.

## Objectives

After completing this workshop, you will be able to:

- Set up an ISP entitlement in the developer console
- Configure your interaction model to handle ISP
- Update your Lambda service code to be able to handle the various requests from the purchase flow

## Prerequisites

This lab requires:

- Access to a notebook computer with Wi-Fi, running Microsoft Windows, Mac OSX, or Linux (Ubuntu, SuSE, or RedHat).
- An Internet browser suchas Chrome, Firefox, or IE9 (previous versions of Internet Explorer are not supported).
- Having completed **[Step 0: Initialize Riddle Game](https://github.com/CamiWilliams/LevelUpRiddles-Workshop/tree/master/Step%200%20-%20Initialize%20Riddle%20Game)**
- Having completed **[Step 1: Add Advanced Voice Design](https://github.com/CamiWilliams/LevelUpRiddles-Workshop/tree/master/Step%201%20-%20Add%20Advanced%20Voice%20Design)**

## Goal: Integrating Premium Features into your skill
ISP supports one-time purchases for entitlements that unlock access to features or content in your skill, subscriptions that offer access to premium features or content for a period of time, and consumables which can be purchased, depleted and purchased again.

You can define your premium offering and price, and we handle the voice-first purchasing flow. We also provide self-service tools to manage your in-skill products, and optimize their sales performance over time. Today, you can make money through both ISP and Alexa Developer Rewards. This feature is available for Alexa skills in the US.

### Task 2.1: Build the Premium Feature into your skill
Before we start to integrate a formal ISP flow into our skill, we need to build the premium feature into the skill. This will mean creating an intent for when the customer asks for a hint in the game.

1. Navigate to the Amazon Developer Portal at[https://developer.amazon.com/alexa](https://developer.amazon.com/alexa).
2. Click **Sign In** in the upper right.
3. When signed in, click **Your Alexa Dashboards** in the upper right.
4. Choose your **Riddle Game Workshop** skill.
5. In the left-hand menu, click the **+ Add** icon to add an intent
6. Create a custom intent called "HintIntent"
7. Enter the following sample utterances for HintIntent:

```
give me a hint
i need a hint
tell me a hint
hint
i need another hint
i need a clue
i want a clue
clue
give me a clue
tell me a clue
i need another clue
```

8. **Save** and **Build** your interaction model.

This has updated our interaction model to be able to understand when the user requests for a hint. Now we need to be able to handle this in our service code. Once this is done, we will put this ability behind an ISP flow.

9. Navigate to your service code.
10. Update the `riddle_objects.js` file to add a `hints` array to each JSON object (you can copy it directly from [here](https://github.com/CamiWilliams/LevelUpRiddles-Workshop/blob/master/Step%202%20-%20Add%20ISP/lambda/custom/riddle_objects.js)).
11. In your `index.js`, add a handler for the HintIntent to read off all requested hints for the current question:

```
const HintIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HintIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const index = sessionAttributes.currentHintIndex;

    // Read all hints the customer has asked for thus far
    let speechText = "Okay, here are your hints: ";
    let i = 0;
    while (i <= index) {
      speechText += sessionAttributes.currentRiddle.hints[i] + ", ";
      i++;
    }
    speechText += ". Here is your question again: "
        + sessionAttributes.currentRiddle.question;

    // Update the current hint index, maximum of 3 hints per riddle
    sessionAttributes.currentHintIndex = index == 2 ? 2 : (index + 1);
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(sessionAttributes.currentRiddle.question)
      .withSimpleCard('Level Up Riddles', speechText)
      .getResponse();
  }
};
```
It is important to note, in this code we keep track of a new session attribute: `sessionAttributes.currentHintIndex`. We need to initialize this attribute at the start of the game play.

12. Initialize `sessionAttributes.currentHintIndex` to 0 in `PlayGameIntent`, and for each new question in `AnswerRiddleIntent`.
13. Finally, add `HintIntentHandler` to your **RequestHandler** builder.
14. **Upload your code** to your Lambda function and click the **Save** button in the top of the page. This will upload your function code into the Lambda container.

After the Save is complete, you may or may not be able your code editor inline.

### Task 2.2: Test that the Premium Feature works in your skill
At this point we should test that hints work within your Riddle Game skill. You can test your skill in the Developer Portal or in Lambda using the JSON Input from the testing console.

1. Navigate to the **Test** tab of the Developer Portal.
2. In **Alexa Simulator** tab, under **Type or click…**, type &quot;open riddle game workshop&quot;
3. You should hear and see Alexa respond with the message in your LaunchRequest. Now type "i want three easy riddles".
4. When Alexa is done reading off the first riddle, respond with "i need a hint". Assure you get an appropriate response.

### Task 2.3: Add In-Skill Purchasing into your interaction model
Now we are going to add In-Skill purchasing into our skill. This will allow a customer to pay for a premium feature within your skill. You can integrate ISP into your skill through the Developer Portal or via the ASK-CLI.

1. Navigate to the **Build** tab of the Developer Portal.
2. Scroll down on the left-menu and select **IN-SKILL PRODUCTS**
3. You are now in the ISP management portal. Click the blue **Create In-Skill Product** button.
4. Type `hint_pack` in **Reference Name** field.
5. Assure that **One-Time Purchase** is selected as the product type.
6. Click the blue **Create In-Skill Product** button.
7. Fill all the metadata fields for `hint_pack` as follows:
	- **Display Name:** Hint Pack
	- **One Sentence Description:** Hint pack for the Riddle Game skill
	- **Detailed Description:** Unlock the hint pack for the Riddle Games skill to be able to request hints within the game.
	- **Example Phrases:** Tell me a hint, Give me a hint, I need a hint
	- **Icons:** Use the [Alexa Icon Builder](https://developer.amazon.com/docs/tools/icon-builder.html) to make the icons for your product, and upload each size appropriately
	- **Keywords:** hint, hints, clue, clues
	- **Purchase Prompt Description:** The hint pack includes three hints to help you solve each riddle in Riddle Game.
	- **Purchase confirmation description:** Purchase the hint pack?
	- **Privacy policy URL:** [https://privacy.com](https://privacy.com)
8. Click the **Save and Continue** button.
9. **Select a price** for your product (default is $0.99).
10. Assure the **Release Date** set to today.
11. Set the **Tax Category** for your product to "Information Services".
12. Click the **Save and Continue** button.
13. For **Testing Instructions**, insert your example phrases: Tell me a hint, Give me a hint, I need a hint.
14. Click the **Save and Finish** button.
15. You will see a prompt - “Link hint_pack to your skill Premium Facts Skill?” - Click on **Link to skill**.

### Task 2.4: Add ISP into your service
Now that we can recognize ISP requests and responses within our skill, we need to handle it within our skill.

1. Firstly, we need two helper functions to let us know how to define an Entitlement within our skill. **Add** the following helper functions to `index.js`:

```
function isProduct(product) {
  return product && product.length > 0;
}

function isEntitled(product) {
  return isProduct(product) && product[0].entitled == 'ENTITLED';
}
```

2. **Navigate** to our `HintIntentHandler` in `index.js`.
3. At the top of the `handle` function, **insert the following lines of code:**

```
handle(handlerInput) {
  const locale = handlerInput.requestEnvelope.request.locale;
  const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
```
The first line grabs the customer's local, and the second begins the monetization flow.

4. Wrap the logic we wrote in Task 2.1 in the following return statement:

```
  return ms.getInSkillProducts(locale).then(function(res) {
		// Task 2.1 logic here
  });
```
This statement will return an appropriate response depending on whether the customer has already made a purchase or not.

5. Now we need to determine what product a customer could purchase at this point in the skill, and if they have purchased it. **Insert the following code:**

```
  return ms.getInSkillProducts(locale).then(function(res) {
    var product = res.inSkillProducts.filter(record => record.referenceName == 'hint_pack');
    
    if (isEntitled(product)) {
      // Task 2.1 logic here
    } else {
      
    }
```
The customer will be pushed into the `else` statement if they have not purchased `hint_pack`. It will enter the ISP flow and ask if the user would like to complete a purchase.

6. **Insert the following code** into the `else` statement:

```
  const upsellMessage = "You don't currently own the hint pack. Want to learn more about it?";
  
  return handlerInput.responseBuilder
    .addDirective({
      'type': 'Connections.SendRequest',
      'name': 'Upsell',
      'payload': {
        'InSkillProduct': {
          'productId': product[0].productId
        },
        'upsellMessage': upsellMessage
      },
      'token': 'correlationToken'
    })
    .getResponse();
```

In this case, we are sending a directive with the name `Upsell`. This is indicating we are entering the ISP flow with the directive to tell the customer more information about the product before they purchase. We also need to create a similar intent for when the customer requests to buy something directly.

7. **Create a custom intent** named "BuyIntent" for your interaction model in the Developer Portal with the following utterances

```
buy
buy hints
i want to buy hints
buy hints for my game
buy me hints
purchase hints
purchase clues
buy clues
buy clues for my game
```

8. In `index.js`, **create a handler** for `BuyIntent` that can send a directive of type `Connections.SendRequest` with the name `Buy` to buy the `hint_pack` directly:

```
const BuyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
       handlerInput.requestEnvelope.request.intent.name === 'BuyIntent';
  },
  handle(handlerInput) {  
    // Inform the user about what products are available for purchase
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function(res) {
      let product = res.inSkillProducts.filter(record => record.referenceName == "hint_pack");

      return handlerInput.responseBuilder
        .addDirective({
          'type': 'Connections.SendRequest',
          'name': 'Buy',
          'payload': {
            'InSkillProduct': {
              'productId': product[0].productId
            }
          },
          'token': 'correlationToken'
        })
        .getResponse();
    });
  }
};
```
Once either the `Buy` or `Upsell` directive is sent, the customer has the option to ask for more information, or step out of the purchasing flow. We need to incorporate handlers for these steps.

9. First, let's handle the `Upsell` request. **Create** an `UpsellResponseHandler` that matches the following:

```
const UpsellResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "Connections.Response" &&
        handlerInput.requestEnvelope.request.name === "Upsell";
  },
  handle(handlerInput) {
    if (handlerInput.requestEnvelope.request.status.code == 200) {
      let speechOutput = "";
      let reprompt = "";

      if (handlerInput.requestEnvelope.request.payload.purchaseResult == 'ACCEPTED') {
        speechOutput = "You can now ask for hints in your game! To get a hint, say, i want a hint.";
        reprompt = "Let's play a new game with hints! Would you like to start with easy, medium, or hard riddles?";
      } else if (handlerInput.requestEnvelope.request.payload.purchaseResult == 'DECLINED') {
        speechOutput = "Okay. I can't offer you any hints at this time. ";
        reprompt = "Let's play a game. Would you like to start with easy, medium, or hard riddles?";
      }

      return handlerInput.responseBuilder
        .speak(speechOutput + reprompt)
        .reprompt(reprompt)
        .getResponse();
    } else {
      // Something has failed with the connection.
      console.log('Connections.Response indicated failure. error:' + handlerInput.requestEnvelope.request.status.message); 
      return handlerInput.responseBuilder
        .speak("There was an error handling your purchase request. Please try again or contact us for help.")
        .getResponse();
    }
  }
};
```
Notice how the returned response is just a normal speech response, indicating we are leaving the ISP flow.

Our `BuyResponseHandler` will look very similar. The major difference between this and the `UpsellResponseHandler` is that we need to formulate our response in the context of getting more product information than just what was read in the Upsell.

10. Now let's handle the `Buy` request. **Create** an `BuyResponseHandler` that matches the following:

```
const BuyResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "Connections.Response" &&
        handlerInput.requestEnvelope.request.name === "Buy";
  },
  handle(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const productId = handlerInput.requestEnvelope.request.payload.productId;

    return ms.getInSkillProducts(locale).then(function(res) {
      let product = res.inSkillProducts.filter(record => record.productId == productId);
      let speechOutput = "";
      let reprompt = "";

      if (handlerInput.requestEnvelope.request.status.code == 200) {
        if (handlerInput.requestEnvelope.request.payload.purchaseResult == 'ACCEPTED') {
          speechOutput = "You can now ask for hints in your game! To get a hint, say, i want a hint.";
          reprompt = "Let's play a new game with hints! Would you like to start with easy, medium, or hard riddles?";
        } else if (handlerInput.requestEnvelope.request.payload.purchaseResult == 'DECLINED') {
          speechOutput = "Thanks for your interest in the " + product[0].name + ". ";
          reprompt = "Let's play a game. Would you like to start with easy, medium, or hard riddles?";
        }

        return handlerInput.responseBuilder
          .speak(speechOutput + reprompt)
          .reprompt(reprompt)
          .getResponse();
      } else {
        // Something has failed with the connection.
        console.log('Connections.Response indicated failure. error:' + handlerInput.requestEnvelope.request.status.message);
        return handlerInput.responseBuilder
          .speak("There was an error handling your purchase request. Please try again or contact us for help.")
          .getResponse();
      }
    });
  }
};
```

We have now finished our intent handers for the ISP flow within our skill. We need to add these intents to our skill request handler.

11. **Add** `BuyIntentHandler`, `UpsellResponseHandler`, and `BuyResponseHandler` to your **RequestHandler** builder.
12. **Upload your code** to your Lambda function and click the **Save** button in the top of the page. This will upload your function code into the Lambda container.

After the Save is complete, you may or may not be able your code editor inline.

### Task 2.5: Test that the ISP works in your skill

We will now test our skill again to assure that the ISP flow works and that our hints are accessible ONLY after a purchase flow is successful. As always, you can test your skill in the Developer Portal or in Lambda using the JSON Input from the testing console.

1. Navigate to the **Test** tab of the Developer Portal.
2. In **Alexa Simulator** tab, under **Type or click…**, type &quot;open riddle game workshop&quot;
3. You should hear and see Alexa respond with the message in your LaunchRequest. Now type "i want three easy riddles".
4. When Alexa is done reading off the first riddle, respond with "i need a hint". **Assure that she asks you if you want to purchase hints.**
5. She should respond with "You don't currently own the hint pack. Want to learn more about it?". Type "yes".
6. She should now read your **entitlement description**. Respond "yes" to buy it.
7. Now that you have purchased a hint pack, we can start a new game with hints! Say "i want three easy riddles" and assure you can ask for hints throughout the game.


### Congratulations! You have finished Task 2!


## License

This library is licensed under the Amazon Software License.
