# Add Displays with the Alexa Presentation Language 

The Alexa Presentation Language (APL) is Amazon’s new voice-first design language you can use to create rich, interactive displays for Alexa skills and tailor the experience for tens of millions of Alexa-enabled devices. Using APL, you can easily build customized, robust displays that coincide with your personal brand and the context of your voice experience.

In this workshop, you will enhance the customer's interaction with Riddle Game by incorporating displays using APL. These displays will handle user interactions alongside voice.

## Objectives

After completing this workshop, you will be able to:

- Create APL documents for your intents
- Make your displays dynamic via your voice datasource
- Utilize transformers to use voice-visual components
- Send events from your display to your voice service
- Handle display user events in your voice service


## Prerequisites

This lab requires:

- Access to a notebook computer with Wi-Fi, running Microsoft Windows, Mac OSX, or Linux (Ubuntu, SuSE, or RedHat).
- An Internet browser suchas Chrome, Firefox, or IE9 (previous versions of Internet Explorer are not supported).
- Having completed **[Step 0: Initialize Riddle Game](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/tree/master/Step%200%20-%20Initialize%20Riddle%20Game)**
- Having completed **[Step 1: Add Advanced Voice Design](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/tree/master/Step%201%20-%20Add%20Advanced%20Voice%20Design)**
- Having completed **[Step 2: Add In-Skill Purchasing](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/tree/master/Step%202%20-%20Add%20ISP)**

## Goal: Create an enriching visual experience in your skill
Voice is the most natural form of interaction. But in a voice-first world, visuals can enhance interactions with Alexa-enabled devices. By combining visual elements with voice experiences, developers can expand the possibilities of what their skills can do. Alexa-enabled devices have varying display sizes and shapes, purposes, and hardware limitations. For example, while using a skill on an Echo Spot or Fire TV may have similar spoken interactions for a customer, interactivity and information rendered on the screen may vary drastically depending on the device features.

You will create 4 display screens: one for the `LaunchRequest`, `PlayGameIntent`, `AnswerRiddleIntent`, and `HintIntent`. 

### Task 3.1: Build an APL document for your LaunchRequest that send UserEvents 

We will now add some displays to your skill's `LaunchRequest`. The LaunchRequest is the function that is called when a user invokes your skill without an utterance, just the invocation name (for example, "Alexa open riddle game").

When the customer invokes your skill and the `LaunchRequest`, Alexa prompts the user _"Would you like to start with easy, medium, or hard riddles?"_ We want to create a display with buttons that a customer can select to chose their level.

One of the benefits of using APL is that you can tailor your visual experience according to the device medium. So, for each APL document we create, we will have a _landscape_ and _round_ experience.

![Launch Request round display](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/imgs_of_apl_screens/launchrequest_round.png?raw=true)

![Launch Request landscape display](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/imgs_of_apl_screens/launchrequest_landscape.png?raw=true)

 
1. In the **Developer Portal** , select the **Build** tab in the top menu.
2. Click on the **Interfaces** tab on the left menu.
3. Scroll to the bottom and toggle **Alexa Presentation Language** to on. This will allow you to use APL in your skill.
4. Click on the **Save Interfaces** button at the top.
5. Once the interfaces are saved, click on **Build Model.**
6. Scroll down and select the **Display** tab on the left menu.
7. This will navigate you to the [**APL Authoring Tool**](https://developer.amazon.com/alexa/console/ask/displays?). This is an authoring tool used to create and edit APL documents for your skill. There are currently 7 sample templates you can use. For now, we will start from scratch. Select **Start from scratch**.

  - _Note:_ This is an authoring tool and NOT a simulator. To interact with and test your APL documents within the context of your skill, you need to add them to your skill and test in the testing console of the developer portal, or use the **Send to Device** feature in the authoring tool.

8. In the top pane, you can toggle between different devices. Select **Small Hub**.
9. Select the two **toggles** on the middle-right and top-right of the authoring tool. This should switch views to raw-code and side-by-side respectively. You should see this APL code in the editor:

```
{
    "type": "APL",
    "version": "1.0",
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "layouts": {},
    "mainTemplate": {
        "items": []
    }
}
```
APL is made up of [Components](https://developer.amazon.com/docs/alexa-presentation-language/apl-component.html) dictated in the mainTemplate. A component is a primitive element that displays on the viewport of the device.

10. Under items, **add** a **Container** component. This component can contain and orient child components.

```
{
    "type": "APL",
    "version": "1.0",
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "layouts": {},
    "mainTemplate": {
        "items": [
            {
                "type": "Container",
                "width": "100vw",
                "height": "100vh",
                "items": []
            }
        ]
    }
}
```
This Container currently has a width 100% of the viewport width (100vw) and 100% of the viewport height (100vh).

11. Add a child component to the Container. **Insert** a [**Frame**](https://developer.amazon.com/docs/alexa-presentation-language/apl-frame.html) component that has a `backgroundColor` set to green.

```
{
    "type": "APL",
    "version": "1.0",
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "layouts": {},
    "mainTemplate": {
        "items": [
            {
                "type": "Container",
                "width": "100vw",
                "height": "100vh",
                "items": [
                    {
                        "type": "Frame",
                        "width": "100vw",
                        "height": "100vh",
                        "backgroundColor": "green",
                        "position": "absolute"
                    }
                ]
            }
        ]
    }
}
```

The Frame can be of any shape, size and color. It supports solid and transparent colors (HEX or rgba). In this scenario, we are using it to apply a background color.

Now, we will specify named theme colors for our document. [Resources](https://developer.amazon.com/docs/alexa-presentation-language/apl-resources.html) are the global variables of APL documents dictated by the `@` symbol.

12. Add the following `resources` to your APL document, and update the `Frame` `backgroundColor` to be `@myBlack`.

```
{
    "type": "APL",
    "version": "1.0",
    "theme": "dark",
    "import": [],
    "resources": [
        {
            "description": "Colors dark to light",
            "colors": {
                "myBlack": "#343838",
                "myPurple": "#9C0A54",
                "myRed": "#FC2D47",
                "myOrange": "#FD704B",
                "myYellow": "#FDB04F",
                "myWhite": "#FFFFFF"
            }
        }
    ],
    "styles": {},
    "layouts": {},
    "mainTemplate": {
        "items": [
            {
                "type": "Container",
                "width": "100vw",
                "height": "100vh",
                "items": [
                    {
                        "type": "Frame",
                        "width": "100vw",
                        "height": "100vh",
                        "backgroundColor": "@myBlack",
                        "position": "absolute"
                    }
                ]
            }
        ]
    }
}
```

13. Add another child component to the Container. Insert a Text component that reads "Riddle Game".

```
{
    "type": "APL",
    "version": "1.0",
    "theme": "dark",
    "import": [],
    "resources": [
        ...
    ],
    "styles": {},
    "layouts": {},
    "mainTemplate": {
        "items": [
            {
                "type": "Container",
                "width": "100vw",
                "height": "100vh",
                "items": [
                    {
                        "type": "Frame",
                        "width": "100vw",
                        "height": "100vh",
                        "backgroundColor": "@myBlack",
                        "position": "absolute"
                    },
                    {
                        "type": "Text",
                        "text": "Riddle Game",
                        "color": "@myWhite",
                        "fontWeight": "900",    
                        "width": "100vw",
                        "fontSize": "10vh",
                        "paddingTop": "12vh",
                        "textAlign": "center"
                    }           
                ]
            }
        ]
    }
}
```

Now you can see the Texton the screen. Note that it is styled with known front-end properties. **Toggle** in between the various devices. If you click on Medium Hub, Large Hub, and Extra-Large TV in the authoring tool, you can see the same experience on every device.

Now that we have a visual experience that fits for every device, lets build according to the device type. This will be utilizing the built-in **viewport properties** that specifies device characteristics like size, shape, and orientation.

14. Under the `Frame` component, **insert** two `Container` components. On each, add a **when** statement. The when statement uses data-binding to show or hide the component it is attached to based upon the condition specified. The first condition should be _"if the viewport shape is round"_. The second condition should be _"if the viewport shape is NOT round"_.
15. **Duplicate** the `Text` component in each `Container` and restyle to fit the device.

```
{
	...
    "mainTemplate": {
        "items": [
            {
                "type": "Container",
                "width": "100vw",
                "height": "100vh",
                "items": [
                    {
                        "type": "Frame",
                        "width": "100vw",
                        "height": "100vh",
                        "backgroundColor": "@myBlack",
                        "position": "absolute"
                    },
                    {
                        "when": "${viewport.shape == 'round'}",
                        "type": "Container",
                        "width": "100vw",
                        "height": "100vh",
                        "items": [
		                    {
		                        "type": "Text",
		                        "text": "Riddle Game",
		                        "color": "@myWhite",
		                        "fontWeight": "900",    
		                        "width": "100vw",
		                        "fontSize": "10vh",
		                        "paddingTop": "12vh",
		                        "textAlign": "center"
		                    }
		                ]
		             },
                    {
                        "when": "${viewport.shape != 'round'}",
                        "type": "Container",
                        "width": "100vw",
                        "height": "100vh",
                        "direction": "row",
                        "items": [
                            {
                                "type": "Text",
                                "text": "Riddle Game",
                                "color": "@myWhite",
                                "fontWeight": "900",    
                                "width": "50vw",
                                "height": "100vh",
                                "fontSize": "20vh",
                                "paddingLeft": "5vw",
                                "textAlignVertical": "center"
                            }
                         ]
                    } 
                ]
            }
        ]
    }
}

```
Now we are creating similar experiences tailored according to device shape. Note that the second `Container` has the property `direction: row`. This will align any child components side-by-side instead of one on top of the other.

Now we are going to create the buttons a user can select to chose a level. Each button will be styled similarly, but with different text and colors.

In order to reduce repetitive code, we are going to create our button as a [Layout](https://developer.amazon.com/docs/alexa-presentation-language/apl-layout.html). A layout is composite components that you can define, name, and reuse in your document. You can also host layouts to reuse in other skills (you can do this in **extra credit**).

16. Scroll to the top of your APL document and find the property `layouts`.
17. Within `layouts`, create a child JSON object named `HomePageButton`.

```
{
    "type": "APL",
    "version": "1.0",
    "theme": "dark",
    "import": [],
    "resources": [
    	  ...
    ],
    "styles": {},
    "layouts": {
    	  "HomePageButton": {
    	  }
    },
    "mainTemplate": {
        "items": [
        	  ...
        ]
    }
}
```
When you create a layout, it has two child properties, `parameters` and `items`. The `parameters` are the attributes that are variable to the layout. In our case, it would be the title, and colors. The `items` are where you define the components of the layout.

18. Add `parameters` and `items` to the `HomePageButton` layout. In the `parameters`, add `title`, `primaryColor`, and `secondaryColor`.

```
"layouts": {
    "HomePageButton": {
        "parameters": [
            "title",
            "colorPrimary",
            "colorSecondary"
        ],
        "items": [
        ]
    }
},

```

Since we are creating a button, the first component we will add is a [TouchWrapper](https://developer.amazon.com/docs/alexa-presentation-language/apl-touchwrapper.html). The `TouchWrapper` appears similar to a `Component`, but it also can have the property `onPress` that can send an event or command to the skill code.

One of the commands you can send is called [SendEvent](https://developer.amazon.com/docs/alexa-presentation-language/apl-touchwrapper.html#sample-touchwrapper-for-individual-image). This will send a request to the service code that is interpreted as a `UserEvent`. Alongside this `UserEvent`, you can send arguments to distinguish what was pressed.

19. **Add** a `TouchWrapper` to your layout. With the `TouchWrapper`, include an `onPress` property with the attributes `SendEvent`. In the `arguments` of `SendEvent`, **through databinding**, include the `title` parameter of the layout. This will include "Easy", "Medium" or "Hard" in the user event sent to the skill code.

```
"layouts": {
    "HomePageButton": {
        "parameters": [
            "title",
            "colorPrimary",
            "colorSecondary"
        ],
        "items": [
            {
                "type": "TouchWrapper",
                "width": "40vw",
                "height": "20vh",
                "item": {},
                "onPress": {
                    "type": "SendEvent",
                    "arguments": [
                        "${title}"
                    ]
                }
            }
        ]
    }
},
```
Now we need to define what the button will look like within the `TouchWrapper`. As seen in the image above, the button will have two `Frame` components, and a `Text` component.

It is important to note that the `TouchWrapper` component can only have one child, so we will need to wrap the `Frame` and `Text` components in a `Container` before inserting into the `TouchWrapper`.

20. Under the `item` property of the `TouchWrapper`, add a `Container` containing the two `Frames` and `Text` component. The `Frame` colors should use `${colorPrimary}` and `${colorSecondary}`, and the `Text` component should use `${title}` in the `text` property.

```
"layouts": {
    "HomePageButton": {
        "parameters": [
            "title",
            "colorPrimary",
            "colorSecondary"
        ],
        "items": [
            {
                "type": "TouchWrapper",
                "width": "40vw",
                "height": "20vh",
                "item": {
                    "type": "Container",
                    "width": "40vw",
                    "height": "20vh",
                    "items": [
                        {
                            "type": "Frame",
                            "width": "40vw",
                            "height": "20vh",
                            "backgroundColor": "${colorSecondary}",
                            "position": "absolute"
                        },
                        {
                            "type": "Frame",
                            "width": "39vw",
                            "height": "18vh",
                            "backgroundColor": "${colorPrimary}",
                            "position": "absolute"
                        },
                        {
                            "type": "Text",
                            "text": "${title}",
                            "color": "@myWhite",
                            "fontWeight": "900",
                            "fontSize": "6vw",
                            "width": "39vw",
                            "height": "18vh",
                            "textAlign": "center",
                            "textAlignVertical": "center"
                        }
                    ]
                },
                "onPress": {
                    "type": "SendEvent",
                    "arguments": [
                        "${title}"
                    ]
                }
            }
        ]
    }
},
```
Now we have built and globalized our `HomePageButton` layout to use in our `mainTemplate`. Using this layout will be similar to using any other built-in component. 

21. Make sure you are toggled on the **round device**.
22. **Add 3** `HomePageButton` components to the `round` container titled "Easy", "Medium" and "Hard". Use the colors we have defined in `resources` as the `colorPrimary ` and `colorSecondary`. 

```
{
    "when": "${viewport.shape == 'round'}",
    "type": "Container",
    "width": "100vw",
    "height": "100vh",
    "items": [
        {
            "type": "Text",
            "text": "Riddle Game",
            "color": "@myWhite",
            "fontWeight": "900",
            "width": "100vw",
            "fontSize": "10vh",
            "paddingTop": "12vh",
            "textAlign": "center"
        },
        {
            "type": "HomePageButton",
            "title": "Easy",
            "colorPrimary": "@myYellow",
            "colorSecondary": "@myOrange",
            "position": "absolute",
            "top": "28vh",
            "left": "30vw"
        },
        {
            "type": "HomePageButton",
            "title": "Medium",
            "colorPrimary": "@myOrange",
            "colorSecondary": "@myRed",
            "position": "absolute",
            "top": "51vh",
            "left": "30vw"
        },
        {
            "type": "HomePageButton",
            "title": "Hard",
            "colorPrimary": "@myRed",
            "colorSecondary": "@myPurple",
            "position": "absolute",
            "top": "74vh",
            "left": "30vw"
        }    
    ]
}
```
You should be able to see the completed APL document in the visualizer! Notice how if you toggle to other devices, because we added these components to the round device only, they will not appear.

We now need to add the `HomePageButton` components to the landscape devices. Since the parent `Container` uses the direction `row`, we have to wrap the buttons in a second `Container` to assure that they appear stacked on top of one another.

23. **Add** a `Container` **containing 3** `HomePageButton` components to the `!= round` container titled "Easy", "Medium" and "Hard". Use the colors we have defined in `resources` as the `colorPrimary ` and `colorSecondary`. 

```
{
    "when": "${viewport.shape != 'round'}",
    "type": "Container",
    "width": "100vw",
    "height": "100vh",
    "direction": "row",
    "items": [
        {
            "type": "Text",
            "text": "Riddle Game",
            "color": "@myWhite",
            "fontWeight": "900",
            "width": "50vw",
            "height": "100vh",
            "fontSize": "20vh",
            "paddingLeft": "5vw",
            "textAlignVertical": "center"
        },
        {
            "type": "Container",
            "width": "50vw",
            "height": "100vh",
            "items": [
                {
                    "type": "HomePageButton",
                    "title": "Easy",
                    "colorPrimary": "@myYellow",
                    "colorSecondary": "@myOrange",
                    "position": "absolute",
                    "top": "10vh"
                },
                {
                    "type": "HomePageButton",
                    "title": "Medium",
                    "colorPrimary": "@myOrange",
                    "colorSecondary": "@myRed",
                    "position": "absolute",
                    "top": "40vh"
                },
                {
                    "type": "HomePageButton",
                    "title": "Hard",
                    "colorPrimary": "@myRed",
                    "colorSecondary": "@myPurple",
                    "position": "absolute",
                    "top": "70vh"
                }
            ]
        }
    ]
}
```

Now **toggling** between all the different devices, you can see our final `LaunchRequest` displays tailored according to the screen characteristics. 

### Task 3.2: Add the APL document to your skill and handle the UserEvents from the TouchWrappers
We have finished authoring our display screen for our skill, we now need to add this APL code to our skill.

1. **Copy** the entire APL code.
2. **Paste and save** this in a document in your `lambda/custom` folder of your service code (same level as `index.js`) and call it _launchrequest.json_
3. **Navigate** to your `index.js` file.

We will now add an APL directive to the LaunchRequest response. A directive specifies how a compiler (or other translator) should process its input. In this case, our directive type will be `Alexa.Presentation.APL.RenderDocument`, indicating to interpret the input as a document to render as APL, and our input will be our `launchrequest.json` document.

4. **Add** a helper function called `supportsAPL` to determine  if the customer's device has a display.

```
function supportsAPL(handlerInput) {
    const supportedInterfaces =
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
    const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
    return aplInterface != null && aplInterface != undefined;
}
```

5. Scroll up to the `LaunchRequest`
6. **Add** an if statement to determine if the customer's device has a display using the **supportsAPL** function.

```
if (supportsAPL(handlerInput)) {

}
```
7. In the if statement, **paste** the following code to add the APL directive:

```
if (supportsAPL(handlerInput)) {
    handlerInput.responseBuilder
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        document: require('./launchrequest.json')
      });
}
```
We have added the APL document to the skill. Now we need to be able to accept and interpret the `UserEvent` sent when a customer taps on the `TouchWrapper`.

When a customer taps on "Easy", "Medium" or "Hard", the skill should send them to the `PlayGameIntent`.

8. Find the `PlayGameIntent`
9. In the `canHandle`, insert a condition to accept an `Alexa.Presentation.APL.UserEvent`:

```
const PlayGameIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlayGameIntent'
      || handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
  },
```

10. In the `handle`, **add a condition** to determine if the incoming request is a `UserEvent`. If it is a `UserEvent`, we do not need to check for a slot value. Insert the code retrieving the slot values in the else statement.

```
if (request.type === 'Alexa.Presentation.APL.UserEvent') {

} else {
    sessionAttributes.currentLevel = request.intent.slots.level.value;

    // Store the slot values for name and color
    if (request.intent.slots.name.value) {
      sessionAttributes.name = request.intent.slots.name.value;
    }
    
    if (request.intent.slots.color.value) {
      sessionAttributes.color = request.intent.slots.color.value;
    }

    // Check if the slot value for riddleNum is filled and <5, otherwise default to 5
    const riddleNum = request.intent.slots.riddleNum.value;
    if (riddleNum) {
      sessionAttributes.totalRids = riddleNum <= 5 ? riddleNum : 5;
    } else {
      sessionAttributes.totalRids = 5;
    }
}
```

11. In the if block, check the `arguments` of the `UserEvent` to see which title was sent in the request.


```
if (request.type === 'Alexa.Presentation.APL.UserEvent') {
    if (request.arguments[0] === 'Easy') {
        sessionAttributes.currentLevel = "easy"
    } else if (request.arguments[0] === 'Medium') {
        sessionAttributes.currentLevel = "medium"
    } else {
        sessionAttributes.currentLevel = "hard"
    }
    
    sessionAttributes.totalRids = 5;
} else {
    ...
}
```

Our skill is now able to interpret and handle TouchWrapper events appropriately.

12. **Upload your code** to your Lambda function and click the **Save** button in the top of the page. This will upload your function code into the Lambda container.

After the Save is complete, you may or may not be able your code editor inline.

### Task 3.3: Test that the display and touch events work in your skill
We will now test our skill to assure that the APL documents appear in the skill and that the `TouchWrappers` send the proper events to your skill.

1. Navigate to the **Test** tab of the Developer Portal.
2. Assure that **Device Display** is checked.
3. In **Alexa Simulator** tab, under **Type or click…**, type "open riddle game workshop"
3. Scroll down to see that your APL display is showing on a "Medium Hub"
4. **Click** on one of the buttons. Assure that the _User Touch Event_ is sent to Alexa and that the game continues.

### Task 3.4: Add displays for the game play contingent on the skill datasource
Next we will add displays for `PlayGameIntent`, `AnswerRiddleIntent` and `HintIntent`. There will be two cases for `AnswerRiddleIntent`: if they are currently in the game versus if they finish a game.

1. Copy the file [riddle.json](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/lambda/custom/riddle.json) into `lambda/custom`.

![riddle.json round display](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/imgs_of_apl_screens/riddle_round.png?raw=true)

![riddle.json landscape display](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/imgs_of_apl_screens/riddle_landscape.png?raw=true)

2. Find the `PlayGameIntent`
3. **Add** an if statement with the **supportsAPL** function. In the if, add an APL directive adding the `riddle.json` document.

```
if (sessionAttributes.currentIndex == sessionAttributes.totalRids) {
    ...
} else {
    ...
	if (supportsAPL(handlerInput)) {
	  handlerInput.responseBuilder
	    .addDirective({
	      type: 'Alexa.Presentation.APL.RenderDocument',
	      document: require('./riddle.json')
	    });
	}
}
```

4. Find the `AnswerRiddleIntent`
5. Look for the condition that determines if the game is over or should continue with the next riddle.
6. In the else of that statement, **add** an if statement with the **supportsAPL** function. In the if, add an APL directive adding the `riddle.json` document.
7. Copy the file [finishedgame.json](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/lambda/custom/finishedgame.json) into `lambda/custom`.

![finishedgame.json round display](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/imgs_of_apl_screens/finished_round.png?raw=true)

![finishedgame.json landscape display](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/imgs_of_apl_screens/finished_landscape.png?raw=true)

8. In the `AnswerRiddleIntent`, in the condition that determines if the game is over or should continue with the next riddle, **add** an if statement with the **supportsAPL** function. In the if, add an APL directive adding the `finishedgame.json` document.

```
if (sessionAttributes.currentIndex == sessionAttributes.totalRids) {
    ...
	if (supportsAPL(handlerInput)) {
	  handlerInput.responseBuilder
	    .addDirective({
	      type: 'Alexa.Presentation.APL.RenderDocument',
	      document: require('./finishedgame.json')
	    });
	}
} else {
    ...
}
```
9. Copy the file [hint.json](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/lambda/custom/hint.json) into `lambda/custom`.

![hint.json round display](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/imgs_of_apl_screens/hint_round.png?raw=true)

![hint.json landscape display](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/blob/master/Step%203%20-%20Add%20APL/imgs_of_apl_screens/hint_landscape.png?raw=true)

10. In the `HintIntent`, when the customer has purchased hints, **add** an if statement with the **supportsAPL** function. In the if, add an APL directive adding the `hint.json` document.

```
if (supportsAPL(handlerInput)) {
    handlerInput.responseBuilder
        .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: require('./hint.json')
        });
}
```
Now we have added all of our APL documents into our skill code. Each of these documents have data that is contingent on the current riddle. To send this information to the document, we need to add a [datasource](https://developer.amazon.com/docs/alexa-presentation-language/apl-data-source.html) property to our APL directive.

The `datasource` property is a JSON object that can contain any type of information to be inflated on your APL document. This information is accessible in the `mainTemplate` of your APL document in the `payload` variable in `parameters` via databinding. 

11. **Add the following helper function** to formulate a consistent datasource for each APL directive:

```
function createDatasource(attributes) {
  return {
    "riddleGameData": {
        "properties": {
            "currentQuestionSsml": "<speak>" 
                + attributes.currentRiddle.question
                + "<speak>",
            "currentLevel": attributes.currentLevel,
            "currentQuestionNumber": (attributes.currentIndex + 1),
            "numCorrect": attributes.correctCount,
            "currentHintSsml": "<speak>" 
                + attributes.currentRiddle.hints[attributes.currentHintIndex]
                + "<speak>",
        }
    }
  };
}
```
In this function, `attributes` represents the current `sessionAttributes` of that state of the game.

12. For each APL directive, **add a `'datasources'` attribute** pointing to the return value of the `createDatasource` function:

```
if (supportsAPL(handlerInput)) {
    let data = createDatasource.call(this, sessionAttributes);
    handlerInput.responseBuilder
      .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          document: require('./riddle.json'),
          'datasources': data
      });
}
```
We have successfully added logic to send dynamic skill information to our APL documents.

### Task 3.5: Integrate transformers into your displays for a voice-first visual experience
A great way to marry your voice output to your visual output is through [Commands](https://developer.amazon.com/docs/alexa-presentation-language/apl-standard-commands.html). It will allow for a more seamless experience for your customer to quickly gain information from the display.

In our skill, we will be using the [SpeakItem](https://developer.amazon.com/docs/alexa-presentation-language/apl-standard-commands.html#speakitem-command). This command allows the text appearing on screen to be highlighted as Alexa reads it. We will add this command to the Riddle being read.

For us to integrate this command into our skill, we will need to use transformers in our datasource. Transformers take a simple string and transform it to another object. In our case, we will be **adding an `ssmlToSpeech` and an `ssmlToText`** transformer.

1. Look at the `Text` component in `riddle.json`. You will notice that it contains both `text` and `speech` properties.
2. **Navigate** to the `createDatasource` helper function
3. At the same level of `properties`, **add** a `transformer` JSON object.

```
return {
  "riddleGameData": {
      "properties": {
          ...
       },
       "transformers" : []
  }
};
```

4. **Add** 2 transformers, one to convert SSML to speech and one to convert SSML to text.

```
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
    }
]
```

Alongside the transformer in the datasource and the directive, we also need to send a **Command directive** that will define it is a SpeakItem command.

5. In `index.js`, for any occurence of the directive sending `riddle.json`, **send** an `ExecuteCommand` directive with `SpeakItem`. Assure that the tokens for both directives match:

```
if (supportsAPL(handlerInput)) {
    let data = createDatasource.call(this, sessionAttributes);
    handlerInput.responseBuilder
      .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          token: 'riddleToken',
          document: require('./riddle.json'),
          'datasources': data
      })
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'riddleToken',
        commands: [
          {
            type: 'SpeakItem',
            componentId: 'riddleComp',
            highlightMode: 'line'
          }
        ]
      });
}
```

In order to assure Alexa doesn't repeat herself from this command, we need to **delete** reading the riddle and the hint from our speech output.

6. In `PlayGameIntent`, delete the riddle being read from the `.speech` but **NOT** `.reprompt` for **ONLY** the visual experience.
7. In `AnswerRiddleIntent`, delete the riddle being read from the `.speech` but **NOT** `.reprompt` for **ONLY** the visual experience.

Now we have integrated a voice and visual experience that both complement each other!


### Task 3.6: Test that all the displays appear within your skill

Now we will experience the full gameplay and assure that each display appears properly for your Riddle Game.

1. Navigate to the **Test** tab of the Developer Portal.
2. In **Alexa Simulator** tab, under **Type or click…**, type &quot;open riddle game workshop&quot;
3. You should hear and see Alexa respond with the message in your LaunchRequest. Now type "i want three easy riddles".
5. Walk through each of the questions and check to see that the screens display the appropriate riddle. You can also ask for hints to assure the correct hint appears.
  - Note that the SpeakItem command _may not appear in the simulator_, due to the fact that the highlight color defaults to white. You can test on a device where the highlight color will default to Alexa blue!
6. Finish the game and assure that your score appears correctly.

### Task 3.7 (Extra Credit): Host your layouts in S3 to reuse in multiple APL documents

Stay tuned!

### Task 3.8 (Extra Credit): Update your displays to use the customer's favorite color

Stay tuned!

### Congratulations! You have finished Task 3!


## License

This library is licensed under the Amazon Software License.
