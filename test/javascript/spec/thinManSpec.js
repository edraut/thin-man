describe("thin_man", function(){

  function getAjaxArg(arg_name){
    return $.ajax.calls.argsFor(0)[0][arg_name];
  }

  describe("AjaxLinkSubmission", function(){
    it("submits an ajax call with options", function(){
      var $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"][href="/url"][data-ajax-method="PATCH"][data-return-type="json"]');
      thin_man.AjaxLinkSubmission($link)
      spyOn($, 'ajax');
      $link.click();
      expect($.ajax).toHaveBeenCalled();
      expect(getAjaxArg("url")).toMatch("/url");
      expect(getAjaxArg("type")).toMatch("PATCH");
      expect(getAjaxArg("datatype")).toMatch("json");
    });

    it("ajaxSuccess", function(){
      var $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"][data-return-type="json"]');
      var $target = affix('#test_dom_id');
      var thin = new thin_man.AjaxLinkSubmission($link)
      thin.ajaxSuccess({ html: "Hello" }, 'success', Object)
      expect($target.html()).toEqual("Hello")
    });

    it("on ajaxSuccess focus on first element", function(){
      var $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"]');
      var $target = affix('#test_dom_id');
      var thin = new thin_man.AjaxLinkSubmission($link)
      var form = '<form><input type="text"><textarea>dummy</textarea></form>'
      thin.ajaxSuccess(form, 'success', Object)
      expect($target.html()).toEqual(form);
      expect($("[type='text']").length).toEqual(1);
      //Check if it's focused
      expect($("[type='text']").get(0)).toBe(document.activeElement);
    });
  });
});
