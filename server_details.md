---
layout: default
---

##Server Options

###Render with convenience
```ruby
def show
  render_ajax locals: {post: @post}
end
```
If the name of the partial you want to render is the same as the action name, use `render_ajax` to simplify your rendering calls. The example above would render the partial named 'show' (ie. filename begins with `_show.`)

###Respond with a flash message

```ruby
render json: {flash_message: "Your changes were saved.", html:
  {render_to_string partial: 'show', locals: {post: @popst}}
```
Notice the `html:` key. If you're responding with an html partial in addition to other data, you'll need to render your html to a string so that it can be included in a JSON response.

You can also render flash messages upon errors by setting the HTTP response status code to 403 for access denied, or 409 for an invalid request that was handled but could not be accommodated.

```ruby
render json: {flash_message: "Access denied."}, status: 403
```

#####Flash styling

######DOM element
thin_man expects to find a hidden element with the DOM id 'thin-man-flash-container' on the page. It should wrap another element with the id 'thin-man-flash-content'. It will use this to display the flash message. You can style this container however you wish, in keeping with the styles of your project.
Here is an example:

```HTML
    <div class="alert" style="display: none;" id="thin-man-flash-container">
      <a class="close" data-dismiss="alert">&#215;</a>
      <div id="thin-man-flash-content">Your changes were saved</div>
    </div>
```
The classes are merely suggestions, you should style this to meet the design of your project. The dismiss element is also merely a suggestion, you can use whatever method fits the look and feel of your project, e.g. a data attribute that you can bind in your custom JS to fade out after n seconds.

######Dynamic CSS classes
thin_man will dynamically add a css class to the flash container based on the HTTP status code. If the code is 200, then it will add `alert-success`. If the status is 403 or 409 it will add `alert-error`. You can create these classes to style the flash messages however you like.

###Respond with javascript methods to be called

This is intended for naming a Javascript function and passing it JSON parameters, no actual javascript implementation should live here.

> If you are tempted to handle side-effects for other resources this way, don't shoot yourself in the foot like that.
> Use the `foreign_office` gem to broadcast the state of associated objects from the server and have listeners on the
> page that will update associations and aggregations independently of thin_man. `thin_man` is meant to operate on one
> resource at a time.

```ruby
render json: {function_calls: {'myUtilities.redirectToPage' => next_step_url}}
```

The only case we've see for this is reloading the page after a single-page ajax wizard-style sequence has completed.
We don't want to redirect the page if there was an error in the last ajax step for the wizard, but if it succeeds we
do want to redirect the page.

**You can combine `function_calls`, `flash_message`, and `html` keys as necessary.**

