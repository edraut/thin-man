describe("thin_man", function(){

  function getAjaxArg(arg_name){
    return $.ajax.calls.argsFor(0)[0][arg_name];
  }

  describe("Base class", function(){
    beforeAll(function(){
      jasmine.Ajax.install();
      jasmine.clock().install();
    });

    describe(".ajaxSucess", function(){
      var $link, $target, thin;

      beforeEach(function(){
        $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"]');
        $target = affix('#test_dom_id');
        thin = new thin_man.AjaxLinkSubmission($link);
      });

      it("Add result to the target", function(){
        thin.ajaxSuccess({ html: "Hello" }, 'success', TestResponses.success)
        expect($target.html()).toEqual("Hello")
        expect(false).toEqual(true)
      });

      it("focus on first element", function(){
        var form = '<form><input type="text"><textarea>dummy</textarea></form>'
        thin.ajaxSuccess(form, 'success', TestResponses.success)
        expect($target.html()).toEqual(form);
        expect($("[type='text']").length).toEqual(1);
        //Check if it's focused
        expect($("[type='text']").get(0)).toBe(document.activeElement);
      });
    });

    describe(".ajaxComplete", function(){
      var $link, thin;

      beforeEach(function(){
        $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"] #test_dom_id');
        affix('#thin-man-flash-container #thin-man-flash-content');
        thin = new thin_man.AjaxLinkSubmission($link);
      });

      it("display flash message", function(){
        var thin = new thin_man.AjaxLinkSubmission($link);
        thin.ajaxComplete(TestResponses.success);
        expect($('body #thin-man-flash-content').text()).toMatch('successfully response')
      });

      it("fade out if flash_persist is false", function(){
        spyOn($.fn, 'fadeOut');
        thin.ajaxComplete(TestResponses.success);
        jasmine.clock().tick(2000);
        expect($.fn.fadeOut).toHaveBeenCalled();
      });
    });
  });

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

  });


  describe("AjaxFormSubmission", function(){
    it("submits an ajax call with options", function(){
      var $form = affix('form[data-ajax-form="true"][method="PATCH"][action="/url"]');
      $form.affix('input[type="text"][name="name"][value="Jon Snow"]')
      thin_man.AjaxFormSubmission($form)
      spyOn($, 'ajax');
      $form.submit();
      expect($.ajax).toHaveBeenCalled();
      expect(getAjaxArg("url")).toMatch("/url");
      expect(getAjaxArg("type")).toMatch("PATCH");
      expect(getAjaxArg("datatype")).toMatch("html");
    });

    describe("GET request", function(){
      var $form;

      beforeEach(function() {
        $form = affix('form[data-ajax-form="true"][action="/url"][method="GET"]');
      });

      it("serialize data", function(){
        $form.affix('input[type="text"][name="name"][value="Jon Snow"]');
        thin_man.AjaxFormSubmission($form);
        spyOn($, 'ajax');
        $form.submit();
        expect($.ajax).toHaveBeenCalled();
        expect(getAjaxArg("data")).toEqual([{ name: 'name', value: 'Jon Snow' }]);
      });

      it(".getProcessData", function(){
        var thin = new thin_man.AjaxFormSubmission($form)
        expect(thin.getProcessData()).toBe(true);
      });

      it(".sendContentType", function(){
        var thin = new thin_man.AjaxFormSubmission($form)
        expect(thin.sendContentType()).toBe(true);
      });
    });

    describe("POST/PATCH/DELETE request", function(){
      var $form;
      beforeEach(function(){
        $form = affix('form[data-ajax-form="true"][action="/url"]');
      });

      it("Set data in a FormData object", function(){
        thin_man.AjaxFormSubmission($form)
        spyOn($, 'ajax');
        $form.submit();
        expect(getAjaxArg("data")).toEqual(jasmine.any(FormData));
      });

      it(".getProcessData", function(){
        var thin = new thin_man.AjaxFormSubmission($form)
        expect(thin.getProcessData()).toBe(false);
      });

      it(".sendContentType", function(){
        var thin = new thin_man.AjaxFormSubmission($form)
        expect(thin.sendContentType()).toBe(false);
      });
    });

  });
});
