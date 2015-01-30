---
layout: default
---

###Server Options

####Respond with javascript methods to be called

This is intended for naming a Javascript function and passing it JSON parameters, no actual javascript implementation should live here.

```ruby
render json: {function_calls: {'myUtilities.redirectToPage' => next_step_url}}
```

The only case we've see for this is reloading the page after a single-page ajax wizard-style sequence has completed.
We don't want to redirect the page if there was an error in the last ajax step for the wizard, but if it succeeds we
do want to redirect the page.

Purists avert your delicate eyes, there's Javascript in my Ruby *gasp*! Yes, we feel that
having javascript implementation in our view files is far worse than having some asynchronous RPC in our Ruby.  It's just asynchronous RPC people.

You can also pass an html key with a render_to_string call as the value if you want to do both, but in that case we'd recommend
just adding data attributes to your response that can be bound by some custom javascript you provide in a javascript file.

####Respond with a javscript class to instantiate

Similar to the above, but calls 'new' on the class, passing in the params.

```ruby
render json: {class_triggers: {'myRedirectClass' => next_step_url}}
```

