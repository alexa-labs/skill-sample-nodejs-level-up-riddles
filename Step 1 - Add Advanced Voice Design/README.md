# Add Advanced Voice Design

In this section of the workshop, you will incorporate Auto slot delegation into your skill. Auto delegation promotes a more conversational VUI design. When launched, this Alexa skill will have the customer interact with a Riddle Game skill that requests them to provide both the level type and how many questions they'd like to answer.

## Objectives

After completing this workshop, you will be able to:

- Configure Intents, Sample Utterances, and Slots
- Update your Lambda service code to be able to handle auto delegation

## Prerequisites

This lab requires:

- Access to a notebook computer with Wi-Fi, running Microsoft Windows, Mac OSX, or Linux (Ubuntu, SuSE, or RedHat).
- An Internet browser suchas Chrome, Firefox, or IE9 (previous versions of Internet Explorer are not supported).
- Having completed **[Step 0: Initialize Riddle Game](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/tree/master/Step%200%20-%20Initialize%20Riddle%20Game)**

## Goal: Handling more complex dialog in your skill.
Real conversations are dynamic, moving between topics and ideas fluidly. To create conversational Alexa skills, design for flexibility and responsiveness. Skills should be able to handle variations of conversation, conditional collection of data, and switching context mid-conversation. Auto Delegation and Dialog management makes these natural interactions possible.

To read about Dialog Management, go [here](https://build.amazonalexadev.com/alexa-skill-dialog-management-guide-ww.html).

### Task 1.1: Update your Interfaces
In order to achieve our more advanced conversational experience, we need to incorporate Auto Delegation into our skill.

1. Navigate to the Amazon Developer Portal at[https://developer.amazon.com/alexa](https://developer.amazon.com/alexa).
2. Click **Sign In** in the upper right.
3. When signed in, click **Your Alexa Dashboards** in the upper right.
4. Choose your **Riddle Game Workshop** skill.
5. Click on **Interfaces** on the left menu.
6. Assure that **Auto Delegation** is toggled. Note: it may already be toggled as it is enabled by default.

### Task 1.2: Use Auto Delegation in your Interaction Model
When a customer launches the Riddle Game Workshop skill, we want to update our opening message to request that they provide what level they want to source riddles from, along with how many riddles they would like to play with, their name, and favorite color.

As the skill stands, we already have the `level` slot in the `PlayGameIntent`. In this task, we want to make that the required slot, and add optional slots of `riddleNum`, `name`, and `color`.

1. Select the **PlayGameIntent** in the left menu, under Interaction Model. This is the intent logically follows the LaunchRequest, where Alexa will prompt the user for the `level` slot to be filled.
2. Scroll down to **Intent Slots**. In row 2, toggle your mouse into _Create a new slot_ and type "riddleNum".
3. Hit the **+** icon or _Enter_.
4. Repeat the same process for "name" and "color".
5. Next to each new slot, there is a dropdown menu to _Select a slot type_. For "riddleNum", select **AMAZON.NUMBER**.
3. For "name", select **AMAZON.US_FIRST_NAME**.
4. For "color", select **AMAZON.Color**.
5. Scroll up to **Sample Utterances**. Add each of the following utterances individually:

```
let's start
i want to play
i want {riddleNum} riddles
give me {riddleNum} riddles
my name is {name}
my name is {name} and my favorite color is {color}
i am {name}
i am {name} and i like {color}
my favorite color is {color}
{riddleNum} of the {level} riddles
i like {color}
i like {color} and {level} riddles
my favorite color is {color} and {riddleNum} {level}
i want {riddleNum} {level} riddles
give me {riddleNum} {level} riddles
my name is {name} and i want {level} riddles
my name is {name} and i want {riddleNum} {level} riddles
my name is {name} and my favorite color is {color} and i want {riddleNum} {level} riddles
give me {riddleNum} {level}
{name} and {color} and i want {riddleNum} {level} riddles
{name} {color} {riddleNum} level {level}
```
Each of these utterances shows a varying combination of what a customer could say to initiate the gameplay, on top of the utterances we already have trained in our skill. Now, we need to make sure that out of each of these, the customer will at least fill the `level` slot.

5. Under **Intent Slots**, click on "level".
6. Toggle "Is this slot required to fulfill the intent" under **Slot Filling**.

You will see two fields appear: **Alexa speech prompts** and **User utterances**. The former is what Alexa will say to prompt the user to fill the `level` slot. The latter is what the user might say in response to Alexa's prompt.

7. Add the following to **Alexa speech prompts**.

```
Do you want easy, medium, or hard riddles?
Hi {name}, do you want easy, medium or hard riddles?
Which category would you like your {riddleNum} riddles to be sourced from, easy, medium, or hard?
Nice to meet you {name}. You want to play through {riddleNum} riddles. Would you like those to be easy, medium, or hard?
```
Notice how you can incorporate slots that the customer has potentially filled within your speech prompt.

8. Add the following to **User utterances**.

```
{level}
level {level}
{level} riddles
{riddleNum} {level} riddles
{riddleNum} {level}
{riddleNum} of the {level} riddles
```
9. Now navigate back to your `PlayGameIntent`.
10. You will notice under **Dialog Delegation Strategy** that "fallback to skill setting" is selected. Select **enable auto delegation**.
11. Scroll up, and click **Save Model**.
12. Once it is done being saved, click **Build Model**.

### Task 1.3: Update your Skill Lambda

At this point in your development lifecycle, I recommend updating your code locally as it could start to get large. The code editor in AWS Lambda may not show your code depending on its size. With each iteration of your skill code, you can [**Upload a .zip** into Lambda](https://github.com/alexa-labs/skill-sample-nodejs-level-up-riddles/tree/master/Step%200%20-%20Initialize%20Riddle%20Game#uploadzip).

1. Open **index.js**
2. In the `handle` of your `LaunchRequestHanler`, update the `speechText` to also request a name, favorite color, and number of riddles.

```
    const speechText = "Welcome to Level Up Riddles! Before we get started, I need a few pieces of information."
        + " What is your name and favorite color?"
        + " How many riddles would you like to play with?"
        + " Would you like to start with easy, medium, or hard riddles?";
```

3. Now we need to store those slot values as variables in our code, and use them within our skill logic. Navigate to `PlayGameIntentHandler`.
In the `handle` of `PlayGameIntentHandler`, you will see that we are already getting the value of the `level` slot and defaulting to `'easy'` if it isn't filled. Now that we have marked `level` as required, we no longer need that condition.
4. Delete `const spokenLevel = ... if(spokenLevel) {...} else {...}`.
5. Insert the following line:

```
sessionAttributes.currentLevel = request.intent.slots.level.value;
```

We need to check and see if the customer provided a `name`, `color`. 

6. Insert the following conditions:

```
    // Store the slot values for name and color
    if (request.intent.slots.name.value) {
      sessionAttributes.name = request.intent.slots.name.value;
    }

    if (request.intent.slots.color.value) {
      sessionAttributes.color = request.intent.slots.color.value;
    }
```
Finally, we need to check if the customer has provided a value for `riddleNum`. If they have, we need to assure that the number does not exceed 5, and that the game only lists off that number of riddles.

6. Insert the following condition:

```
    // Check if the slot value for riddleNum is filled and <5, otherwise default to 5
    const riddleNum = request.intent.slots.riddleNum.value;
    if (riddleNum) {
      sessionAttributes.totalRids = riddleNum <= 5 ? riddleNum : 5;
    } else {
      sessionAttributes.totalRids = 5;
    }

```

Now we need to update the `AnswerRiddleIntentHandler` to incorporate what the user potentially provided for `riddleNum`.

7. Navigate to `AnswerRiddleIntentHandler`.
8. In `handle`, find the line `if (sessionAttributes.currentIndex == RIDDLES.LEVELS[sessionAttributes.currentLevel].length)`
9. Update the condition to instead read:

```
// If the customer has gone through all riddles, report the score
if (sessionAttributes.currentIndex == sessionAttributes.totalRids) {
```

10. Finally, we need to reset the `totalRids` attribute to 5 if this condition is true, indicating that the game is over and the customer can refill the `riddleNum` slot. Add the following line within the condition:

```
sessionAttributes.totalRids = 5;
```

11. **Upload your code** to your Lambda function and click the **Save** button in the top of the page. This will upload your function code into the Lambda container.

After the Save is complete, you may or may not be able your code editor inline.

### Task 1.4: Test your voice interaction

We&#39;ll now test your skill in the Developer Portal. You can also optionally test your skill in AWS Lambda using the JSON Input from the testing console.

1. Navigate to the **Test** tab of the Developer Portal.
2. In **Alexa Simulator** tab, under **Type or click…**, type &quot;open riddle game workshop&quot;
3. You should hear and see Alexa respond with the message in your LaunchRequest. Now type "i want three easy riddles".
4. Walk through the game and assure that only 3 riddles are asked.


### Congratulations! You have finished Task 1!


## License

This library is licensed under the Amazon Software License.
