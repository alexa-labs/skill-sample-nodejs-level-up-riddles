## Level Up Riddles 

Level Up Riddles was built to showcase the Alexa Presentation Language. A user opens the skill and selects to play with easy, medium, or hard riddles. After their selection, Alexa gives them 10 riddles per commanded category. A user goes through trying to answer the riddles, to which Alexa responds with celebration if correct, the correct answer if incorrect. At the end, Alexa totals the number of correct riddles they answered.

With APL, you can develop visual templates for skills formatted anyway you'd like. Those can now be retooled to fit more clearly and pleasingly on the screen.

The main template for the LaunchRequest utilizes a [TouchWrapper](https://developer.amazon.com/docs/alexa-presentation-language/apl-touchwrapper.html). A TouchWrapper wraps a single child and responds to touch events. In the skill code, a touch or click is registered via a UserEvent.

## License

This library is licensed under the Amazon Software License.
