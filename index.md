---
layout: default
---

###How it works

####In your views
The basic method uses data attributes. The first example sends an AJAX request to retrieve a form for editing a user, then replaces the html of the DOM element selected by the css selector #user-\<user.id\> with the ajax response, presumeably the user edit form.

```ruby
<%= link_to 'edit', edit_user_path(user),
    data: {ajax_link: true, ajax_target: "#user-#{user.id}"} %>
```

This example posts/patches a form with user data via AJAX and replaces the html of the DOM element selected by #user-\<user.id\> with the response, presumeably the read-only representation of the user record.

```ruby
<%= form_for user, html: {
    data: { ajax_form: true, ajax_target: "#user-#{user.id}"} } do |f| %>
...
```

This creates a delete link that will remove the DOM element selected by #user-\<user.id\> after receiving a success response.

```ruby
<%= link_to 'delete', user_path,
    data: {ajax_delete: true, ajax_target: "#user-#{user.id}" %>
```

There are some view helpers if you prefer them. This does the same thing as the first example:

```ruby
<%= ajax_link 'edit', edit_user_path(user), {}, "#user-container-#{user.id}" %>
```

And this does the same thing as the second example:

```ruby
<%= form_for(user, html: ajax_hash("#user-#{user.id}") do |f| %>
```

See [here](/thin-man/client_details.html) for more options and ways to customize the behavior of ajax requests.


####In your controllers

The most basic method is to simply respond with an html partial:

```ruby
render partial: 'edit', locals: { user: @user }
```

See [here](/thin-man/server_details.html) for more dark magic you can do from your controller to vivify your client.

### How to make a restul-AJAX app with ThinMan
It's all good and well to give you this general-purpose Rails AJAX tool, but if you want to put together
a restful AJAX app that doesn't suck, [follow these patterns](/thin-man/restful_ajax.html) we've learned from experience.

### Extending ThinMan
If you want to extend the javascript behaviors in ThinMan, [see here](/thin-man/extending.html)

### Authors and Contributors
Eric Draut (@edraut), Adam Bialek (@abialek)
