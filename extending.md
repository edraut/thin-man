---
layout: default
---

###Extending ThinMan

ThinMan uses John Resig's Javascript Class extension. You can subclass any of the ThinMan classes and extend the behavior.

```javascript
var AjaxBlinkLink = AjaxLinkSubmission.extend({
  ajaxSuccess: function(data,textStatus,jqXHR) {
    this._super(data,textStatus,jqXHR);
    myLibrary.blinkThis($(this.jq_obj));
  }
});
```

Full documentation on the methods and attributes to use when extending can be written if there is demand. Add an issue
in the ThinMan wiki and mention @edraut.