var initThinMan = function(){
  thin_man = {
    getSubClass: function(sub_class_name,parent_class){
      if((typeof(sub_class_name) == 'string') && (sub_class_name != '') && (sub_class_name != 'true')){
        var this_class = sub_class_name;
      } else {
        var this_class = parent_class;
      }
      return this_class;
    },
    AjaxSubmission: Class.extend({
      init: function(jq_obj,params){
        this.jq_obj = jq_obj;
        this.params = params;
        if(!this.params){ this.params = {}}
        this.getTrigger();
        this.getTarget();
        this.getErrorTarget();
        this.progress_color = jq_obj.data('progress-color');
        this.progress_target = $(jq_obj.data('progress-target'));
        this.custom_progress = typeof(jq_obj.data('custom-progress')) != 'undefined';
        if(!this.progress_target){
          this.progress_target = this.trigger
        }
        this.insert_method = this.getInsertMethod();
        var ajax_submission = this;
        this.ajax_options = {
          url: ajax_submission.getAjaxUrl(),
          type: ajax_submission.getAjaxType(),
          datatype: ajax_submission.getAjaxDataType(),
          data: ajax_submission.getData(),
          beforeSend: function(jqXHr) { return ajax_submission.ajaxBefore(jqXHr) },
          success: function(data,textStatus,jqXHR) { ajax_submission.ajaxSuccess(data,textStatus,jqXHR) },
          error: function(jqXHr) { ajax_submission.ajaxError(jqXHr) },
          complete: function(jqXHr) { ajax_submission.ajaxComplete(jqXHr) },
          processData: ajax_submission.getProcessData()
        };
        if(!this.sendContentType()){
          this.ajax_options.contentType = false
        };
        if(typeof this.customXHR === 'function'){
          this.ajax_options.xhr = this.customXHR
          this.ajax_options.thin_man_obj = this;
        }
        $.ajax(this.ajax_options);
      },
      getTarget: function(){
        var target_selector = this.jq_obj.data('ajax-target');
        if(target_selector){
          this.target = $(target_selector);
        }
      },
      getErrorTarget: function(){
        if($(this.jq_obj.data('error-target')).length > 0){
          this.error_target = $(this.jq_obj.data('error-target'));
        }else{
          this.error_target = $(this.jq_obj.data('ajax-target'));
        }
      },
      getAjaxDataType: function(){
        return this.jq_obj.data('return-type') || 'html';
      },
      getInsertMethod: function(){
        return this.jq_obj.data('insert-method') || 'html';
      },
      getData: function() {
        return null;
      },
      getProcessData: function() {
        return true;
      },
      sendContentType: function() {
        return true;
      },
      insertHtml: function(data) {
        if(this.target){
          this.target[this.insert_method](data);
          this.target.find('input,select,textarea').filter(':visible:enabled:first').each(function(){
            if(!$(this).data('date-picker')){
              $(this).focus();
            }
          });
        }
      },
      ajaxSuccess: function(data,textStatus,jqXHR){
        if(typeof data === 'string'){
          this.insertHtml(data);
        } else if(typeof data === 'object') {
          if(typeof data.html != 'undefined'){
            this.insertHtml(data.html)
          }
          if(typeof data.class_triggers != 'undefined'){
            $.each(data.class_triggers, function(class_name, params){
              try{
                klass = eval(class_name);
                new klass(params);
              } catch(err) {
                console.log("Error trying to instantiate class " + class_name + " from ajax response:")
                console.log(err)
              }
            })
          }
          if(typeof data.function_calls != 'undefined'){
            $.each(data.function_calls, function(func_name, params){
              try{
                func = eval(func_name);
                func(params);
              } catch(err) {
                console.log("Error trying to instantiate function " + func_name + " from ajax response:")
                console.log(err)
              }
            })
          }
        }
        if(this.target){
          var ajax_flash = this.target.children().last().data('ajax-flash');
          if((jqXHR.status == 200) && ajax_flash){
            new thin_man.AjaxFlash('success', ajax_flash.notice,this.target);
          }
        }
        if(this.removeOnSuccess()){
          if($(this.removeOnSuccess())){
            $(this.removeOnSuccess()).remove();
          }
        }
        if(this.emptyOnSuccess()){
          if($(this.emptyOnSuccess())){
            $(this.emptyOnSuccess()).empty();
          }
        }
      },
      ajaxComplete: function(jqXHR) {
        this.showTrigger();
        if(this.progress_indicator){
          this.progress_indicator.stop();
        } else {
          this.progress_target.remove();
        }
        try{
          response_data = JSON.parse(jqXHR.responseText)
        } catch(err) {
          response_data = {}
          // hmmm, the response is not JSON, so there's no flash.
        }
        if(typeof response_data.flash_message != 'undefined'){
          var flash_style = this.httpResponseToFlashStyle(jqXHR.status);
          var flash_duration = null;
          if(typeof response_data.flash_persist != 'undefined'){
            if(response_data.flash_persist){
              flash_duration = 'persist'
            } else {
              flash_duration = 'fade'
            }
          }
          if(this.target){
            new thin_man.AjaxFlash(flash_style, response_data.flash_message,this.target, flash_duration);
          }else{
            new thin_man.AjaxFlash(flash_style, response_data.flash_message,this.jq_obj, flash_duration);
          }
        }
        if('function' == typeof this.params.on_complete){
          this.params.on_complete()
        }
      },
      ajaxBefore: function(jqXHr) {
        this.toggleLoading();
        if(!this.custom_progress){
          this.progress_indicator = new thin_man.AjaxProgress(this.progress_target,this.target,this.progress_color);
        }
      },
      ajaxError: function(jqXHR) {
        if(jqXHR.status == 409){
          this.error_target.html(jqXHR.responseText);
        }else if(jqXHR.status == 500){
          alert('There was an error communicating with the server.')
        }
      },
      getTrigger: function(){},
      hideTrigger: function(){},
      showTrigger: function(){},
      toggleLoading: function() {
        if(this.target){
          if (this.target.find('[data-loading-visible="false"]').length > 0) {
            this.target.find('[data-loading-visible="false"]').hide();
          }
          if (this.target.find('[data-loading-visible="true"]').length > 0) {
            this.target.find('[data-loading-visible="true"]').show();
          }
        }
      },
      removeOnSuccess: function(){
        return this.jq_obj.data('remove-on-success')
      },
      emptyOnSuccess: function(){
        return this.jq_obj.data('empty-on-success')
      },
      httpResponseToFlashStyle: function(response_code){
        if([403,409,500].indexOf(response_code) > -1){
          return 'error'
        }
        if([200,202].indexOf(response_code) > -1){
          return 'success'
        }
        return 'error'
      }
    }),
    AjaxBrowserPushConnector: Class.extend({
      init: function($connector){
        this.trigger = $connector.find('button, input[type="submit"]');
        if(this.trigger.length < 1){
          this.trigger = $connector;
        }
        this.browser_push_progress_indicator = new thin_man.AjaxProgress(this.trigger,this.trigger,this.progress_color);
        $connector.data('browser-push-progress-indicator-object', this.browser_push_progress_indicator);
      }
    }),
    AjaxBrowserPushFlash: Class.extend({
      init: function($flash){
        this.message = $flash.data('ajax-browser-push-flash')
        this.$target = $($flash.data('ajax-browser-push-flash-target'));
        this.$target.data('ajax-browser-push-flash',this.message);
      }
    }),
    AjaxProgress: Class.extend({
      init: function(target,alt,progress_color){
        if(target.length > 0){
          this.progress_target = target;
        } else if(typeof(alt) != 'undefined') {
          this.progress_target = alt;
        } else {
          this.progress_target = $('body');
        }
        if(!progress_color){
          progress_color = 'black';
        }
        this.progress_container = $('#ajax_progress_container').clone();
        uuid = new UUID;
        this.progress_container.prop('id', uuid.value);
        this.progress_target.append(this.progress_container);
        this.progress_container.css({
          display: 'block', visibility: 'visible', position: 'absolute', top: '50%', left: '50%',
          'color': progress_color, 'z-index': 1000000,
          '-ms-transform': 'translate(-50%, -50%)', /* IE 9 */
          '-webkit-transform': 'translate(-50%, -50%)', /* Safari */
          'transform': 'translate(-50%, -50%)'
        })
      },
      stop: function(){
        this.progress_container.remove();
      }
    }),
    AjaxFlash: Class.extend({
      init: function(type,message,elem,duration){
        this.flash_container = $('#thin-man-flash-container').clone();
        $('body').append(this.flash_container);
        this.flash_container.css({position:'absolute',visibility: 'hidden'});
        this.alert_type = type;
        this.elem = elem;
        var alert_class = 'alert-' + type;
        this.flash_container.addClass(alert_class);
        $('#thin-man-flash-content', this.flash_container).html(message);
        this.flash_container.show();
        this.setFadeBehavior(duration);
        this.reposition(elem);
      },
      setFadeBehavior: function(duration){
        if(duration){
          if('persist' == duration){
            this.fade = false
          } else {
            this.fade = true
          }
        }else{ //default behavior if persist duration is not sent back with message
          if('error' == this.alert_type || 'warning' == this.alert_type || 'info' == this.alert_type){
            this.fade = false;
          } else {
            this.fade = true;
          }
        }
      },
      reposition: function(elem){
        var this_window = {
          top: $(window).scrollTop(),
          left: $(window).scrollLeft(),
          height: $(window).outerHeight(),
          width: $(window).outerWidth()
        };
        var this_flash = {
          height: this.flash_container.outerHeight(),
          width: this.flash_container.outerWidth()
        }
        this_window.vert_middle = (this_window.top + (this_window.height / 2));
        this_window.horiz_middle = (this_window.left + (this_window.width / 2));
        this_flash.half_height = (this_flash.height / 2);
        this_flash.half_width = (this_flash.width / 2);
        var new_top = this_window.vert_middle - this_flash.half_height;
        var new_left = this_window.horiz_middle - this_flash.half_width;
        this.flash_container.css({left: new_left, top: new_top, visibility: 'visible'});
        var ajax_flash = this;
        if (this.fade) {
          setTimeout(function(){ajax_flash.fadeOut()},1618);
        }
      },
      fadeOut: function(){
        this.flash_container.fadeOut('slow');
      }
    }),
    AjaxSorter: Class.extend({
      init: function($sort_container){
        var base_url = $sort_container.data('url');
        $sort_container.sortable({
          helper: "clone",
          tolerance: 'pointer',
          stop: function( event, ui) {
            new thin_man.AjaxSortSubmission($sort_container);
          }
        });
        $sort_container.disableSelection();
      }
    })
  };
  thin_man.AjaxFormSubmission = thin_man.AjaxSubmission.extend({
    getAjaxUrl: function(){
      return this.jq_obj.attr('action');
    },
    getAjaxType: function(){
      return this.jq_obj.attr('method') || 'POST'
    },
    getData: function(){
      if(this.getAjaxType().toLowerCase() == 'get'){
        var data_array = this.jq_obj.serializeArray();
        return data_array;
      }else{
        // need to implement a data-attribute for multiple file fields so we can allow selecting mutliple files at once. example here:
        // http://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata
        return new FormData(this.jq_obj[0]);
      }
    },
    getProcessData: function() {
      if(this.getAjaxType().toLowerCase() == 'get'){
        return true;
      }else{
        return false;
      }
    },
    sendContentType: function() {
      if(this.getAjaxType().toLowerCase() == 'get'){
        return true;
      }else{
        return false;
      }
    },
    getTrigger: function(){
      this.trigger = this.jq_obj.find('button, input[type="submit"]');
    },
    hideTrigger: function(){
      this.trigger.css('visibility','hidden');
    },
    showTrigger: function(){
      this.trigger.css('visibility','visible');
    }
  }),
  thin_man.AjaxLinkSubmission = thin_man.AjaxSubmission.extend({
    getAjaxUrl: function(){
      return this.jq_obj.attr('href');
    },
    getData: function(){
      var this_data = {authenticity_token: $('[name="csrf-token"]').attr('content')};
      if(this.jq_obj.data('form-data')){
        $.extend(this_data,this.jq_obj.data('form-data'))
      }
      return this_data
    },
    getProcessData: function() {
      return true;
    },
    getAjaxType: function(){
      return this.jq_obj.data('ajax-method') || 'GET'
    },
    getTrigger: function(){
      this.trigger = this.jq_obj;
    },
    hideTrigger: function(){
      this.trigger.css('visibility','hidden');
    },
    showTrigger: function(){
      this.trigger.css('visibility','visible');
    }
  }),
  thin_man.AjaxModalOpener = thin_man.AjaxLinkSubmission.extend({
    ajaxSuccess: function(data,textStatus,jqXHR) {
      this._super(data,textStatus,jqXHR);
      $(this.jq_obj.data('ajax-modal')).modal();
    }
  }),
  thin_man.AddALineForm = thin_man.AjaxFormSubmission.extend({
    ajaxSuccess: function(data,textStatus,jqXHR) {
      this._super(data,textStatus,jqXHR);
      $(this.jq_obj.data('container')).empty();
    },
    ajaxError: function(jqXHR){
      this.insert_method = 'html';
      this._super(jqXHR);
    }
  }),
  thin_man.EmptyForm = thin_man.AjaxFormSubmission.extend({
    ajaxSuccess: function(data,textStatus,jqXHR) {
      var clicked_button = $("input[type=submit][clicked=true]")[0];
      this._super(data,textStatus,jqXHR);
      if ($(clicked_button).data('clone') != true) {
        $(this.jq_obj)[0].reset();
      };
      $(this.jq_obj).find('input[type=text],textarea,select').filter(':visible:first').focus();
      $("[data-autocomplete]").trigger("chosen:updated");
    },
    ajaxError: function(jqXHR){
      this.insert_method = 'html';
      this._super(jqXHR);
    }
  }),
  thin_man.ModalCloserForm = thin_man.AjaxFormSubmission.extend({
    ajaxSuccess: function(data,textStatus,jqXHR) {
      this._super(data,textStatus,jqXHR);
      $modal = $(this.jq_obj.data('modal-container'));
      $modal.modal('hide');
      $modal.remove();
    },
    ajaxError: function(jqXHR){
      this._super(jqXHR);
      $modal = $(this.jq_obj.data('modal-container'));
      $modal.modal();
    }
  }),
  thin_man.ResetOnSubmitForm = thin_man.AjaxFormSubmission.extend({
    ajaxSuccess: function(data, textStatus, jqXHR) {
      this._super(data, textStatus, jqXHR);
      $(this.jq_obj).each(function() {
        this.reset();
      });
    }
  }),
  thin_man.DeleteLink = thin_man.AjaxSubmission.extend({
    ajaxSuccess: function(data,textStatus,jqXHR){
      this._super(data,textStatus,jqXHR);
      if(this.target){
        this.target.remove();
      }
    },
    getAjaxType: function(){
      return 'DELETE';
    },
    getAjaxUrl: function(){
      return this.jq_obj.attr('href');
    },
    getData: function(){
      return {authenticity_token: $('[name="csrf-token"]').attr('content')};
    },
    getProcessData: function() {
      return true;
    },
    ajaxBefore: function(jqXHR){
      return confirm("Are you sure you want to delete this?");
    }
  }),
  thin_man.ReplaceDelete = thin_man.DeleteLink.extend({
    ajaxSuccess: function(data,textStatus,jqXHR){
      this.target[this.insert_method](data);
    },
    ajaxBefore: function(jqXHR){
      //noop
    }
  }),
  thin_man.AjaxSortSubmission = thin_man.AjaxLinkSubmission.extend({
    init: function($form){
      this.sort_field = $form.data('sort-field');
      this._super($form);
    },
    getAjaxUrl: function(){
      return this._super() + '?' + 'sort_field=' + this.sort_field + '&' + this.jq_obj.sortable("serialize");
    },
    getAjaxType: function(){
      return 'PUT';
    },
    ajaxSuccess: function(){

    }
  });

  window.any_time_manager.registerListWithClasses({'sortable' : 'AjaxSorter', 'ajax-link-now' : 'AjaxLinkSubmission'},'thin_man');
  window.any_time_manager.registerList(['ajax-link-now'])
  window.any_time_manager.load();

  $(document).ready(function(){
    $(document).on('click','[data-ajax-link],[data-ajax-link-now]',function(e){
      e.preventDefault();
      var this_class = eval('thin_man.' + thin_man.getSubClass($(this).data('sub-type'),'AjaxLinkSubmission'));
      var submission = new this_class($(this));
      return false;
    });

    $(document).on('submit','[data-ajax-form]',function(e){
      e.preventDefault();
      var this_class = eval('thin_man.' + thin_man.getSubClass($(this).data('sub-type'),'AjaxFormSubmission'));
      var submission = new this_class($(this));
      return false;
    });

    $(document).on('click','[data-ajax-delete]',function(e){
      e.preventDefault();
      var this_class = eval('thin_man.' + thin_man.getSubClass($(this).data('sub-type'),'DeleteLink'));
      var deletion = new this_class($(this));
    });
    $(document).on('click', '[data-change-url]',function(e){
      e.preventDefault();
      new thin_man.AjaxPushState($(this))
    });

    $('[data-sortable]').each(function(){
      new thin_man.AjaxSorter($(this));
    });


  });

};

if(typeof Class === "undefined"){
  /* Simple JavaScript Inheritance
   * By John Resig http://ejohn.org/
   * MIT Licensed.
   */
  // Inspired by base2 and Prototype
  (function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
      var _super = this.prototype;

      // Instantiate a base class (but only create the instance,
      // don't run the init constructor)
      initializing = true;
      var prototype = new this();
      initializing = false;

      // Copy the properties over onto the new prototype
      for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              var tmp = this._super;

              // Add a new ._super() method that is the same method
              // but on the super-class
              this._super = _super[name];

              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);
              this._super = tmp;

              return ret;
            };
          })(name, prop[name]) :
          prop[name];
      }

      // The dummy class constructor
      function Class() {
        // All construction is actually done in the init method
        if ( !initializing && this.init )
          this.init.apply(this, arguments);
      }

      // Populate our constructed prototype object
      Class.prototype = prototype;

      // Enforce the constructor to be what we expect
      Class.prototype.constructor = Class;

      // And make this class extendable
      Class.extend = arguments.callee;

      return Class;
    };
  })();
}

if(typeof UUID == 'undefined'){
  var UUID = Class.extend({
    init: function(){
      this.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
  })
}

if(typeof window.any_time_manager === "undefined" && typeof window.loading_any_time_manager === "undefined"){
  //Anytime loader, simulates load events for ajax requests
  function getSubClass(sub_class_name,parent_class){
    if((typeof(sub_class_name) == 'string') && (sub_class_name != '') && (sub_class_name != 'true')){
      var this_class = sub_class_name;
    } else {
      var this_class = parent_class;
    }
    return this_class;
  };

  String.prototype.toCapCamel = function(){
    camel = this.replace(/[-_]([a-z])/g, function (g) { return g.replace(/[-_]/,'').charAt(0).toUpperCase(); });
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  var AnyTimeManager = Class.extend({
    init: function(){
      this.loader_array = []
    },
    register: function(data_attribute,load_method,base_class,namespace){
      if(!namespace){namespace = ''}else{namespace= namespace + '.'}
      this.loader_array.push({data_attribute: data_attribute, base_class: base_class, load_method: load_method, namespace: namespace});
    },
    registerList: function(list,namespace){
      var anytime_manager = this;
      $.each(list,function(){
        anytime_manager.register(this + '','instantiate',null,namespace)
      })
    },
    registerListWithClasses: function(list,namespace){
      var anytime_manager = this;
      $.each(list,function(attr,klass){
        anytime_manager.register(attr,'instantiate',klass,namespace)
      })
    },
    registerRunList: function(list){
      var anytime_manager = this;
      $.each(list,function(attr,method){
        anytime_manager.register(attr,method,null)
      })
    },
    instantiate: function(jq_obj, class_name){
      if(!jq_obj.data('anytime_loaded')){
        jq_obj.data('anytime_loaded',true);
        var this_class = eval(class_name);
        new this_class(jq_obj);
      }
    },
    run: function (jq_obj, resource, method_name){
      if(!jq_obj.data('anytime_run')){
        jq_obj.data('anytime_run',true);
        resource[method_name](jq_obj);
      }
    },
    load: function(){
      var atm = this;
      $.each(atm.loader_array,function(){
        var data_attribute = this['data_attribute'];
        var base_class = this['base_class'];
        if(!base_class){
          base_class = data_attribute.toCapCamel();
        }
        var this_method = this['load_method'];
        var namespace = this['namespace'];
        $('[data-' + data_attribute + ']').each(function(){
          if('instantiate' == this_method){
            var declared_class = $(this).data('sub-type');
            var this_class = getSubClass(declared_class,base_class);
            this_class = namespace + this_class;
            atm.instantiate($(this),this_class);
          }else{
            atm.run($(this),base_class,this_method);
          }

        });
      });
    }
  });
  window.any_time_manager = new AnyTimeManager();
  $(document).ajaxComplete(function(){
    window.any_time_manager.load();
  });
  $(document).ready(function(){
    if(typeof window.any_time_load_functions != 'undefined'){
      $.each(window.any_time_load_functions, function(i,func){
        func();
      });
    }
    window.any_time_manager.load();
  });

  // End AnyTime library
}

initThinMan();
