---
layout: default
---

###Restful AJAX apps

Let's take the example of Comments on a Post. Say we have a page that displays a Post with all its comments. We'll have a list of Comments and a button/link to create a new comment. If you're the moderator, you might have delete buttons/links for each comment as well.

To keep things manageable, you'll want a container for the list:

```HTML+ERB
<div id="post_#{post.id}_comments">
  <% post.comments.each do |comment| %>
    <%= render partial: 'comments/show', locals: {comment: comment} %>
  <% end %>
</div>
```

Notice the DOM id of the div contains the unique id of the post. If you ever have multiple levels of resources nested on the page this will be important for avoiding duplicate DOM ids that would break ThinMan. Stay in the habit of using unique ids in your
target selectors to avoid unpleasant, hard-to-debug problems down the line.

Now your new comment link can reference the DOM id of your comment list container:

```HTML+ERB
<%= ajax_link 'add a comment', comment_url, {}, "#post_#{post.id}_comments", 'append' %>
```

This link will put the AJAX response at the end of the container, as designated by the jQuery 'append' method.

Now let's look at the comment DOM. You'll need 2 rails view partials for displaying list elements.

The first renders a container, the second renders the contents.

app/views/comments/_show_container.html.erb

```HTML+ERB
<div id="comment_#{comment.id}">
  <%= render partial: 'comments/show', locals: {comment: comment} %>
</div>
```

app/views/comments/_show.html.erb

```HTML+ERB
  <%= comment.body %>
  <%= ajax_link 'edit', edit_comment_url(comment), {} "#comment_#{comment.id}" %>
  <%= link_to 'delete', comment_url(comment), data: {delete_link: true, ajax_target: "#comment_#{comment.id}"} %>
```

app/views/comments/_edit.html.erb

```HTML+ERB
  <%= form_for comment, html: ajax_hash("#comment_#{comment.id}"), do |f| %>
    ...
  <% end %>
```

In your controllers:

app/controllers/comments_controller.rb

```ruby
def show
  render partial: 'show', locals: {comment: @comment}
end

def edit
  render partial: 'edit', locals: {comment: @comment}
end

def create
  @comment = Comment.create(params[:comment])
  render partial: 'show_container', locals: {comment: @comment}
end

def update
  @comment.update_attributes(params[:comment])
  render partial: 'show', locals: {comment: @comment}
end

def destroy
  @comment.destroy
  render nothing: true
end
```