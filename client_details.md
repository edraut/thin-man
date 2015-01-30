---
layout: default
---

###View Options

You can apply these data attributes to dom elements in your views and ThinMan will bind them with the behavior described.

####Standard Options for both links and forms

<p class="callout">
  <span class="fixed-width">data-ajax-link: true</span><br/>
  Apply ajax behavior to this link
</p>

<p class="callout">
  <span class="fixed-width">data-ajax-target: &lt;css selector&gt;</span><br/>
  The DOM element represented by the css selector will be the target for
  placing the ajax response HTML. The default behavior is to replace the
  innerHTML of the element with the response HTML. See data-insert-method for
  options to configure the placement in relation to the target.
  For ajax delete links, this is the DOM element to remove after a success
  response from the server.
</p>

<p class="callout">
  <span class="fixed-width">data-insert-method: &lt;jQuery insertion method&gt;</span><br/>
  How to place the response HTML in relation to the selected target. Uses
  jQuery insertion methods, e.g. 'html', 'append', 'prepend', 'after',
  'before', etc. See the jQuery manipulation docs for more options. The default
  is 'html'.
</p>

<p class="callout">
  <span class="fixed-width">data-error-target: &lt;css selector&gt;</span><br/>
  Where to place the response HTML if the request generated a conflict on the
  server (e.g. the request failed validation). This only takes precedence if
  the server responds with a 409 CONFLICT. It does not handle 500-class
  errors. The default behavior is to use the same DOM element as
  data-ajax-target.
</p>

####Link-only options

<p class="callout">
  <span class="fixed-width">data-method: &lt;HTTP method&gt;</span><br/>
  The HTTP method to use in sending the ajax request
</p>

####Delete-link-only options

<p class="callout">
  <span class="fixed-width">data-ajax-target: &lt;css selector&gt;</span><br/>
  The DOM element that should be removed after a success response for the ajax request
</p>



