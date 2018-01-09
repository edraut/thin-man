describe("thin_man", function(){

  function getAjaxArg(arg_name){
    return $.ajax.calls.argsFor(0)[0][arg_name];
  }

  describe("Base class", function(){
    beforeAll(function(){
      jasmine.Ajax.install();
      jasmine.clock().install();
    });

    describe(".ajaxSuccess", function(){
      var $link, $target, thin;

      beforeEach(function(){
        $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"]');
        $target = affix('#test_dom_id');
        thin = new thin_man.AjaxLinkSubmission($link);
      });

      it("Add result to the target", function(){
        thin.ajaxSuccess({ html: "Hello" }, 'success', TestResponses.success)
        expect($target.html()).toEqual("Hello")
      });

      it("focus on first element", function(){
        var form = '<form><input type="text"><textarea>dummy</textarea></form>'
        thin.ajaxSuccess(form, 'success', TestResponses.success)
        expect($target.html()).toEqual(form);
        expect($("[type='text']").length).toEqual(1);
        //Check if it's focused
        expect($("[type='text']").get(0)).toBe(document.activeElement);
      });

      it("empties the target if there is no html in the json", function(){
        $target.html('Remove me.')
        thin.ajaxSuccess({flash_message: 'Successfully moved the widget.'}, 'success', TestResponses.success)
        expect($target.html()).toEqual('')
      })

      it("handles success with no target", function(){
        $no_target_link = affix('a[data-ajax-link="true"][data-ajax-target=""]');
        thin = new thin_man.AjaxLinkSubmission($no_target_link);
        thin.ajaxSuccess({flash_message: 'Success'},'success', TestResponses.success)
      })
    });

    describe(".ajaxComplete", function(){
      var $link, thin;

      beforeEach(function(){
        $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"] #test_dom_id');
        affix('[data-thin-man-flash-template] [data-thin-man-flash-content]');
        thin = new thin_man.AjaxLinkSubmission($link);
      });

      describe("Display flash message", function(){
        it("successfully response", function(){
          thin.ajaxComplete(TestResponses.success);
          expect(thin.flash.flash_content.text()).toMatch('successfully response');
        });

        it("error response", function(){
          thin.ajaxComplete(TestResponses.error);
          expect(thin.flash.flash_content.text()).toMatch('error response');
        });
      });

      it("fade out if flash_persist is false", function(){
        spyOn($.fn, 'fadeOut');
        thin.ajaxComplete(TestResponses.success);
        jasmine.clock().tick(2000);
        expect($.fn.fadeOut).toHaveBeenCalled();
      });
    });

    describe(".ajaxError", function(){
      var $link, thin;

      beforeEach(function(){
        $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"]');
        $target = affix('#test_dom_id');
        thin = new thin_man.AjaxLinkSubmission($link);
      });

      it('as a string', function(){
        thin.ajaxError(TestResponses.conflictString);
        expect($('#test_dom_id').html()).toMatch('conflict string response');
      });

      it('as an object', function(){
        thin.ajaxError(TestResponses.conflict);
        expect($('#test_dom_id').html()).toMatch('Required field');
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
      expect(thin_man.hasOwnProperty('link_groups')).toEqual(false)
    });
    
    it("submits an ajax call with search params and path", function(){
      var $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"][href="/url"][data-return-type="json"][data-search-params="search_params"][data-search-path="/search_path"]');
      thin_man.AjaxLinkSubmission($link)
      spyOn($, 'ajax');
      $link.click();
      expect($.ajax).toHaveBeenCalled();
      expect(getAjaxArg("url")).toEqual('/search_path?search_params');
    });
    
    it("fires grouped links in sequence", function(){
      var $link_zero = affix('a[data-ajax-link-now="true"][data-ajax-target="#test_dom_id"][href="/url"][data-ajax-method="PATCH"][data-sequence-group="test_group"][data-sequence-number="0"]');
      var $link_one = affix('a[data-ajax-link-now="true"][data-ajax-target="#test_dom_id"][href="/url"][data-ajax-method="PATCH"][data-sequence-group="test_group"][data-sequence-number="1"]');
      var $link_two = affix('a[data-ajax-link-now="true"][data-ajax-target="#test_dom_id"][href="/url"][data-ajax-method="PATCH"][data-sequence-group="test_group"][data-sequence-number="2"]');
      zero = new thin_man.AjaxLinkSubmission($link_zero)
      one = new thin_man.AjaxLinkSubmission($link_one)
      two = new thin_man.AjaxLinkSubmission($link_two)
      expect(thin_man.hasOwnProperty('link_groups')).toEqual(true)
      spyOn(one,'fire')
      spyOn(two,'fire')
      zero.ajaxComplete()
      expect(one.fire).toHaveBeenCalled();
      expect(two.fire).not.toHaveBeenCalled();
      one.ajaxComplete()
      expect(one.fire.calls.count()).toEqual(1);
      expect(two.fire).toHaveBeenCalled();
    })
  });
  describe("DeleteLink", function(){
    it("submits an ajax delete call with options", function(){
      var $link = affix('a[data-ajax-delete="true"][data-ajax-target="#test_dom_id"][href="/url"]');
      var delete_link = new thin_man.DeleteLink($link)
      spyOn($, 'ajax');
      $link.click();
      expect($.ajax).toHaveBeenCalled();
      expect(delete_link.getAjaxType()).toEqual('DELETE')
      expect(delete_link.getAjaxUrl()).toEqual('/url')
      expect(delete_link.trigger).toEqual($link)
    })
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
        var thin = new thin_man.AjaxFormSubmission($form);
        spyOn($, 'ajax');
        $form.submit();
        expect($.ajax).toHaveBeenCalled();
        expect(thin.ajax_options.data).toEqual([{ name: 'name', value: 'Jon Snow' },{name: 'thin_man_submitter', value: 'link_now'}]);
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

    describe("Log", function(){
      beforeEach(function(){
        spyOn(console, 'log');
      });

      it("Don't show a warning with a valid target", function(){
        $link = affix('a[data-ajax-link="true"][data-ajax-target="#test_dom_id"]');
        $target = affix('#test_dom_id');
        thin = new thin_man.AjaxLinkSubmission($link);
        expect(console.log).not.toHaveBeenCalled();
      });

      it("Show a warning when target not found", function(){
        $link = affix('a[data-ajax-link="true"][data-ajax-target="#not_valid_target"]');
        thin = new thin_man.AjaxLinkSubmission($link);
        expect(console.log).toHaveBeenCalledWith('Warning! Thin Man selector #not_valid_target not found');
      });

      it("Show a warning when target not provided", function(){
        $link = affix('a[data-ajax-link="true"]');
        thin = new thin_man.AjaxLinkSubmission($link);
        expect(console.log).toHaveBeenCalledWith('Warning! Thin Man selector not given');
      });
    });

  });
});
