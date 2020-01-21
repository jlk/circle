# Simple Algorithm Experiment in Codesandbox

I was asked recently how one draws a circle without using math functions such as sin(), cos(), or sqrt(). While I think I answered it sorta OK at the time, I kept thinking about it and thought it'd be fun to code it up in JavaScript with the circle rendered. I pondered just putting it on GitHub with a GH page, but I'd read a blog post recently on coding on iPads with no local development environment, so I figured this would be a chance to tinker with Code Sandbox, as well.

The code from this project can be seen and executed in Code Sandbox at https://codesandbox.io/s/github/jlk/circle.

The original algorithm did work, but the problem I ran into was JavaScript does fishy things with floating point numbers. To work around this, I'm fixing lookup keys to 2 decimal places using `Number.parseFloat(x).toFixed(2)`. I don't find this elegant, so as I get a bit of time to tinker some more I'll probably iterate on this further.
