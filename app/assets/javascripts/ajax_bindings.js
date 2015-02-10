//ThinMan javascript
function getSubClass(sub_class_name,parent_class){
  if((typeof(sub_class_name) == 'string') && (sub_class_name != '') && (sub_class_name != 'true')){
    var this_class = sub_class_name;
  } else {
    var this_class = parent_class;
  }
  return this_class;
};

// This is a utility to convert a javascript object to a query string and append it to a url.
function toUrlParams(params){
  var params_array = [];
  $.each(params, function(key,value){
    params_array.push([key,value].join('='));
  });
  return params_array.join('&');
};

function addUrlParams(url,params){
  if(url.match(/\?/)){
    url = url + '&' + toUrlParams(params);
  } else {
    url = url + '?' + toUrlParams(params);
  }
  return url;
};

var AjaxSubmission = Class.extend({
  init: function(jq_obj){
    this.jq_obj = jq_obj;
    this.getTrigger();
    this.getTarget();
    this.getErrorTarget();
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
      complete: function(jqXHr) { ajax_submission.ajaxComplete(jqXHr) }
    };
    $.ajax(ajax_submission.ajax_options);
  },
  getTarget: function(){
    var target_selector = this.jq_obj.data('ajax-target');
    if(target_selector){
      this.target = $(target_selector);
    }
  },
  getErrorTarget: function(){
    if($(this.jq_obj.data('error_target')).length > 0){
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
  insertHtml: function(data) {
    if(this.target){
      this.target[this.insert_method](data);
    }
  },
  ajaxSuccess: function(data,textStatus,jqXHR){
    if(typeof data === 'string'){
      this.insertHtml(data);
    }
    else if(typeof data === 'object'){
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
    var ajax_flash = this.target.children().last().data('ajax-flash');
    if((jqXHR.status == 200) && ajax_flash){
      new AjaxFlash('success', ajax_flash.notice,this.target);
    }
    if ((jqXHR.status == 200) && !(typeof step === 'undefined')) {
      $(form_map[step]).ScrollTo();
    }
  },
  ajaxComplete: function(jqXHR) {
    response_data = JSON.parse(jqXHR.responseText)
    this.showTrigger();
    if(this.progress_indicator){
      this.progress_indicator.stop();
    }
    if(typeof response_data.flash_message != 'undefined'){
      console.log('got a flash')
      flash_style = this.httpResponseToFlashStyle(jqXHR.status)
      console.log(flash_style)
      new AjaxFlash(flash_style, response_data.flash_message,this.target);
    }
  },
  ajaxBefore: function(jqXHr) {
    this.toggleLoading();
    this.progress_indicator = new AjaxProgress(this.trigger);
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
        this.target.find('[data-loading-visible="false"]').addClass('hidden');
      }
      if (this.target.find('[data-loading-visible="true"]').length > 0) {
        this.target.find('[data-loading-visible="true"]').removeClass('hidden');
      }
    }
  },
  httpResponseToFlashStyle: function(response_code){
    if([403,409,500].indexOf(response_code) > -1){
      return 'error'
    }
    if([200].indexOf(response_code) > -1){
      return 'success'
    }
    return 'error'
  }
});

var AjaxBrowserPushConnector = Class.extend({
  init: function($connector){
    this.trigger = $connector.find('button, input[type="submit"]');
    if(this.trigger.length < 1){
      this.trigger = $connector;
    }
    this.browser_push_progress_indicator = new AjaxProgress(this.trigger);
    $connector.data('browser-push-progress-indicator-object', this.browser_push_progress_indicator);
  }
});
var AjaxBrowserPushFlash = Class.extend({
  init: function($flash){
    this.message = $flash.data('ajax-browser-push-flash')
    this.$target = $($flash.data('ajax-browser-push-flash-target'));
    this.$target.data('ajax-browser-push-flash',this.message);
    console.log("AjaxBrowserPushFlash: ")
    console.log(this.message)
    console.log(this.$target.data());
  }
});
var AjaxProgress = Class.extend({
  init: function(target){
    if(target.not(':visible')){
      var targetOffset = target.parent().offset();
    } else {
      var targetOffset = target.offset();
    }
    if(targetOffset){
      var targetLeft = targetOffset.left;
      var targetTop = targetOffset.top;
      this.progress_container = $('#ajax_progress_container').clone();
      uuid = new UUID;
      this.progress_container.prop('id', uuid.value);
      $('body').append(this.progress_container);
      this.progress_container.css({position:'absolute',left: targetLeft, top: targetTop});
      this.progress_container.show();
    }
  },
  stop: function(){
    if(this.progress_container){
      this.progress_container.remove();
      // This is a hack to force finding the element. For some ridiculous reason in certain cases
      // the progress_container is present, can be logged in console, yet cannot be removed.
      // Finding it again by its unique id allows us to remove it. baffled me, but it works now in all known cases.
      $actual_progress_container = $('#' + this.progress_container.attr('id'))
      $actual_progress_container.remove();
    }
  }
});
var AjaxFlash = Class.extend({
  init: function(type,message,elem){
    console.log('ajaxflash:')
    console.log(type)
    console.log(message)
    console.log(elem)
    this.flash_container = $('#ajax_flash_container').clone();
    $('body').append(this.flash_container);
    this.flash_container.css({position:'absolute',visibility: 'hidden'});
    var alert_class = 'alert-' + type;
    this.flash_container.addClass(alert_class);
    $('#ajax_flash_content', this.flash_container).html(message);
    this.flash_container.show();
    this.reposition(elem);
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
    if (! $('form', elem).data('ajax-flash-persist')) {
      setTimeout(function(){ajax_flash.fadeOut()},1000);
    }
  },
  fadeOut: function(){
    this.flash_container.fadeOut('slow');
  }
});

var AjaxFormSubmission = AjaxSubmission.extend({
  getAjaxUrl: function(){
    return this.jq_obj.attr('action');
  },
  getAjaxType: function(){
    return this.jq_obj.attr('method') || 'POST'
  },
  getData: function(){
    var data_array = this.jq_obj.serializeArray();
    return data_array;
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
});

var AjaxLinkSubmission = AjaxSubmission.extend({
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
  getAjaxType: function(){
    return this.jq_obj.data('method') || 'GET'
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
});

var AjaxModalOpener = AjaxLinkSubmission.extend({
  ajaxSuccess: function(data,textStatus,jqXHR) {
    this._super(data,textStatus,jqXHR);
    $(this.jq_obj.data('ajax-modal')).modal();
  }
});

var AddALineForm = AjaxFormSubmission.extend({
  ajaxSuccess: function(data,textStatus,jqXHR) {
    this._super(data,textStatus,jqXHR);
    $(this.jq_obj.data('container')).empty();
  },
  ajaxError: function(jqXHR){
    this.insert_method = 'html';
    this._super(jqXHR);
  }
});

var EmptyForm = AjaxFormSubmission.extend({
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
});

var ModalCloserForm = AjaxFormSubmission.extend({
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
});

var ResetOnSubmitForm = AjaxFormSubmission.extend({
  ajaxSuccess: function(data, textStatus, jqXHR) {
    this._super(data, textStatus, jqXHR);
    $(this.jq_obj).each(function() {
      this.reset();
    });
  }
});

var DeleteLink = AjaxSubmission.extend({
  ajaxSuccess: function(data,textStatus,jqXHR){
    this._super(data,textStatus,jqXHR);
    this.target.remove();
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
  ajaxBefore: function(jqXHR){
    return confirm("Are you sure you want to delete this?");
  }
});

var AjaxSortSubmission = AjaxLinkSubmission.extend({
  getAjaxUrl: function(){
    return this._super() + '?' + this.jq_obj.sortable("serialize");
  },
  getAjaxType: function(){
    return 'PUT';
  },
  ajaxSuccess: function(){

  }
});

var AjaxSorter = Class.extend({
  init: function(jq_obj){
    var sort_container = jq_obj;
    var base_url = sort_container.data('url');
    sort_container.sortable({
      helper: "clone",
      tolerance: 'pointer',
      stop: function( event, ui) {
        new AjaxSortSubmission(sort_container);
      }
    });
    jq_obj.disableSelection();
  }
});


var AjaxPushState = Class.extend({
  init: function(obj) {
    if (obj.data('push-state') != null && obj.data('push-state') != "") {
      history.pushState(null, null, obj.data('push-state'));
    }
  }
});

var RadioFormGroup = Class.extend({
  init: function($form_group){
    this.$form_group = $form_group;
    $form_group.data('form-group', this);
  },
  closeForm: function(){
    this.cancel_button.cancel();
  },
  removeOpenForm: function(){
    delete this.cancel_button;
  }
});

var RadioEdit = Class.extend({
  init: function($radio_edit){
    $radio_edit.data('radio-edit-loaded',true);
    this.$radio_edit = $radio_edit;
    this.$go_link = $($radio_edit.data('radio-edit'));
    var radio_edit = this;
    $radio_edit.bind('click',function(e){
      e.preventDefault();
      radio_edit.tryEdit();
      return false;
    })
  },
  tryEdit: function(){
    if(confirm("Any incomplete changes on other forms will be lost, are you sure you want to open this form?")){
      this.form_group.closeForm();
      step = this.$go_link.data('step-link') - 1;
      this.$go_link.click();
    }
  },
  findGroup: function(){
    $form_group = this.$radio_edit.parents('[data-radio-form-group]')
    this.form_group = $form_group.data('form-group');
  }
});

var RadioCancel = Class.extend({
  init: function($radio_cancel){
    this.$radio_cancel = $radio_cancel;
  },
  findGroup: function(){
    $form_group = this.$radio_cancel.parents('[data-radio-form-group]')
    this.form_group = $form_group.data('form-group');
    this.form_group.cancel_button = this;
  },
  cancel: function(){
    this.$radio_cancel.click();
  }
});

$(document).ready(function(){
  $(document).on('click','[data-ajax-link]',function(e){
    e.preventDefault();
    var this_class = eval(getSubClass($(this).data('sub-type'),'AjaxLinkSubmission'));
    var submission = new this_class($(this));
    return false;
  });

  $(document).on('submit','[data-ajax-form]',function(e){
    e.preventDefault();
    var this_class = eval(getSubClass($(this).data('sub-type'),'AjaxFormSubmission'));
    var submission = new this_class($(this));
    return false;
  });

  $(document).on('click','[data-ajax-delete]',function(e){
    e.preventDefault();
    var this_class = eval(getSubClass($(this).data('sub-type'),'DeleteLink'));
    var deletion = new this_class($(this));
  });

  $(document).on('click','form input[type=submit]',function(e){
    $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
  });

  $('[data-sortable]').each(function(){
    new AjaxSorter($(this));
  });

  $('[data-radio-form-group]').each(function(){
    new RadioFormGroup($(this));
  })
});
$(document).ready(function(){
  $('[data-radio-edit]').each(function(){
    if(!($(this).data('radio-edit-loaded'))){
      var radio_edit = new RadioEdit($(this))
      radio_edit.findGroup();
    }
  });
  $('[data-radio-cancel]').each(function(){
    var radio_cancel = new RadioCancel($(this))
    radio_cancel.findGroup();
  });
});
$(document).ajaxComplete(function(){
  $('[data-radio-edit]').each(function(){
    if(!($(this).data('radio-edit-loaded'))){
      var radio_edit = new RadioEdit($(this))
      radio_edit.findGroup();
    }
  });
  $('[data-radio-cancel]').each(function(){
    var radio_cancel = new RadioCancel($(this))
    radio_cancel.findGroup();
  });
});