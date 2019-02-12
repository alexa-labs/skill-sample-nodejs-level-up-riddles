# Initialize Riddle Game 

In this section of the workshop, you will create and configure a skill using the Alexa Skills Kit SDK in NodeJS and AWS Lambda. When launched, this Alexa skill will have the customer interact with a Riddle Game skill that features a simple voice interaction.

## Objectives

After completing this workshop, you will be able to:

- Create an Amazon Developer account.
- Create and configure a new skill using the Alexa Skills Kit and AWS Lambda
- Create and configure Intents, Sample Utterances, and Slots
- Test a skill using Lambda and an Echo device.

## Prerequisites

This lab requires:

- Access to a notebook computer with Wi-Fi, running Microsoft Windows, Mac OSX, or Linux (Ubuntu, SuSE, or RedHat).
- An Internet browser suchas Chrome, Firefox, or IE9 (previous versions of Internet Explorer are not supported).

## Goal: Completing a voice-only Riddle Game.
Alexa is the voice service that powers Amazon Echo. Alexa provides capabilities, called skills, which enable customers to interact with devices using voice (answer questions, play music, and more).

The Alexa Skills Kit (ASK) is a collection of self-service APIs, tools, documentation, and code samples that make it easy for you to develop your own Alexa skills, which you can then publish. ASK supports simple command-oriented skills, such as &quot;Alexa, ask Greeter to say hello world&quot; as well as sophisticated multi-command dialogs and parameter passing, such as &quot;Alexa, what is this weekend&#39;s weather forecast?&quot; The Alexa Skills Kit is a low-friction way to learn to build for voice.

This task will walk you through creating a simple skill that quizzes the customer through Easy, Medium and Hard riddles. Through this you will use the Alexa skills kit to learn the fundamentals of building a voice user experience.

### Task 0.1: Create an Account on developer.amazon.com (or Sign In)

1. Navigate to the Amazon Developer Portal at[https://developer.amazon.com/alexa](https://developer.amazon.com/alexa).
2. Click **Sign In** in the upper right to create a free account.

### Task 0.2: Create the Riddle Game Workshop Skill

1. When signed in, click **Your Alexa Dashboards** in the upper right.
2. Choose **Get Started** under Alexa Skills Kit. Alexa Skills Kit will enable you to add new skills to Alexa. (The other option, Alexa Voice Services, is what you use if you want to put Alexa onto other devices such as a Raspberry Pi.)
3. To start the process of creating a skill, click the **Create Skill** button on the right.

### Task 0.3: Skill Information

1. Skill Name:enter **Riddle Game Workshop**.
2. Skill Type: Select **Custom Interaction Model**.
3. Language: Select **English (U.S.).**
4. Invocation Name: **riddle game workshop**. This will be the name that you will use to start your skill (eg.,&quot;Alexa, Open _[hello world__]_&quot;.) The invocation name you choose needs to be more than one word and not contain a brand name. Remember the invocation name for future use in this lab.
5. Click **Create Skill**.
6. Select the **Start from scratch** template.
7. Click **Choose**.

### Task 0.4: Interaction Model

1. In the navigation menu on the left, choose **JSON Editor**.
2. **Copy** the JSON from [the en-US language model](https://github.com/CamiWilliams/LevelUpRiddles-Workshop/blob/master/Step%200%20-%20Initialize%20Riddle%20Game/models/en-US.json).

Each of these JSON fields are **Intents**. Intents represent what your skill can do, they are an action Alexa will take. To prompt Alexa for the action, a user would say an **Utterance**. In the case of the **CancelIntent** , the **Utterance** a user would say to perform the cancel action would be &quot;cancel riddles game workshop&quot;.

This skill has two customer intents: `PlayGameIntent` and `AnswerRiddleIntent`. The `PlayGameIntent` starts the gameplay according to the level the user specifies. The `AnswerRiddleIntent` accepts the customer's answer to the riddle, and outputs the next riddle in the series or ends the game.

Some of the utterances include **Slots**. These are items that are variable to what the user says. In the context of this skill, there are two custom slot types. The first is `levelType` which defines a level a user could select. The second is `answerType`, which defines the  correct answers a customer could say to the give riddle. Each slot has synonyms associated to it, which are resolved in the skill code through **Entity Resolution**.

3. Click the **Save Model** button. This will start the process of creating your interaction (If you did not make changes in the Code Editor the **Save Model** button is gray).
4. Click on **Build Model.**
8. We&#39;re now done with the Interaction Model. Choose **Enpoints** in the left menu.

### Task 0.5: Configuration

Your skill needs to be connected to an endpoint that will perform your skill logic. We will be using AWS Lambda for this lab. We will create the Riddle Game Workshop skill Lambda function, copy its ARN (Amazon Resource Name), and paste it into your skill&#39;s configuration page.

1. In a new browser tab, go to [http://aws.amazon.com](http://aws.amazon.com/)
2. **Sign in** to the management console.
3. From the region selector in the upper right, be sure that you&#39;re in the **US East (N. Virginia)** region.
4. From the Services menu on the left of the top menu bar, choose **Services | Compute | Lambda**.
5. Click the orange **Create Function** button in the upper right.
6. Assure that **Author from scratch** is toggled.
7. Name: **riddleGameWorkshop**
8. Runtime: NodeJS 8.10
9. Role: **Create a new role from one or more template(s)**
10. Role name: **riddleGameWorkshopRole**
11. Policy templates: **Simple microservice permissions**
12. Click the orange **Create function** in the lower right.

The Lambda function for your skill has now been created. Now you need to attach your skill to it.

14. In the **Designer** view, under **Add Triggers** , select **Alexa Skills Kit**
15. In the upper-right corner of the page, **copy your ARN**. Copy everything except &quot;ARN-&quot;. It will look like this:
`arn:aws:lambda:us-east-1:123456789012:function:riddleGameWorkshop`
16. Now **switch browser tabs back to your skill** in the developer portal. You should be on the configuration page. (If you closed the browser tab, here&#39;s how to get back: Go to  [http://developer.amazon.com](http://developer.amazon.com/), sign in, click Alexa, click Alexa Skills Kit, click on your skill name, click on configuration from the left-hand menu).
17. Select **Endpoint** from the left menu.
18. For the service endpoint type, choose the **AWS Lambda ARN (Amazon Resource Name)** radio button.
19. **Paste your Lambda ARN** into the Default text field.
20. Click **Save Endpoints**.
21. Copy your skill ID.
22. Navigate back to your **Lambda function tab**. **Click** on the **Alexa Skills Kit** trigger that we previously added in the **Designer** view (it should say &quot;Configuration Required&quot; underneath).
23. Scroll down to the **Configure Triggers** view.
24. Skill id verification: **Enabled**
25. **Paste** your skill id.
26. Click **Add.**
27. Click **Save**.

<a name="uploadzip"></a>Next, we will upload the Riddle Game skill code into Lambda. You should now see details of your riddleGameWorkshop Lambda function that includes your function&#39;s ARN in the upper right and the Configuration view of your function.

28. Click on the **riddleGameWorkshop** part of the tree in the **Designer** view.
29. Scroll down to see the **Function code** view.
30. Code Entry Type: **Upload a .zip file**
31. Ensure **Node.js 8.10** is selected for **Runtime**
32. Handler: **index.handler**.
33. Function Package: **Upload** a .zip of the contents in the lambda/custom folder of this repo.
34. Click the **Save** button in the top of the page. This will upload your function code into the Lambda container.

After the Save is complete, you should see your code editor inline (Note, if your function code becomes large, this view will not be available after uploading, but will still run). 

### Task 0.6: Test your voice interaction

We&#39;ll now test your skill in the Developer Portal. You can also optionally test your skill in AWS Lambda using the JSON Input from the testing console.

1. Switch browser tabs to **the developer portal** (If you closed the browser tab, here&#39;s how to get back: Go to  [http://developer.amazon.com](http://developer.amazon.com/), sign in, click Alexa, click Alexa Skills Kit, click on your skill name, click on configuration from the left-hand menu).
2. Scroll to the top of the page and click **Test**.
3. Switch **Test is disabled for this skill** to Development.
4. In **Alexa Simulator** tab, under **Type or click…**, type &quot;open riddle game workshop&quot;
5. You should hear and see Alexa respond with the message in your LaunchRequest.



### Congratulations! You have finished Task 0!


## License

This library is licensed under the Amazon Software License.
