/*S3*/
thin_man.s3Upload = Class.extend({
  init: function($s3_upload_form){
    this.upload_style = thin_man.getUploadStyle()
    this.$s3_upload_form = $s3_upload_form;
    var s3_upload = this;
    this.$file_fields = this.$s3_upload_form.find('input[type="file"]');
    if(this.$file_fields[0].files.length == 0){
      this.sendWithoutFile()
      return true
    }

    if('single_file' == this.upload_style){
      this.fireOnlyFile()
    } else if('multiple_file' == this.upload_style){
      this.fireMultipleFiles()
    }
  },
  sendWithoutFile: function(){
    this.$s3_upload_form.attr('action',this.$s3_upload_form.data('local-url'));
    var $s3_fields = this.$s3_upload_form.find('[data-sthree-fields]');
    var $csrf_token = $('meta[name=csrf-token]').attr('content')
    $s3_fields.remove();
    this.$s3_upload_form.prepend("<input type='hidden' name='authenticity_token' value='" + $csrf_token + "'>")
    new thin_man.AjaxFormSubmission(this.$s3_upload_form);
  },
  fireOnlyFile: function(){
    var file = this.$file_fields[0].files[0]
    new thin_man.s3UploadOnly(this.$s3_upload_form,file,this);
  },
  fireMultipleFiles: function(){
      this.$file_fields.detach();
      this.ajax_queue_length = 0;
      this.file_queue = [];
      var s3_upload = this
      this.$file_fields.each(function(){
        $.each(this.files, function(index,file){
          s3_upload.file_queue.push(file);
        })
      })
      var i = -1;
      while(++i < 3){ //Start off 3 uploads. The others will be chained as these complete.
        if(this.file_queue.length > 0){
          s3_upload.fireOne(this.file_queue.shift());
        }
      }

  },
  fireOne: function(file){
    var $cloned_form = this.$s3_upload_form.clone();
    new thin_man.s3UploadSingle($cloned_form,file,this);
    this.ajax_queue_length += 1;
  },
  completeOne: function(){
    this.ajax_queue_length -= 1;
    if(this.ajax_queue_length < 3){
      if(this.file_queue.length > 0){
        try{ // This could fail due to a race condition emptying the array. If so, we're done, don't throw an error
          var next_file = this.file_queue.shift();
          this.fireOne(next_file);
        } catch(e){}
      }
    }
    if(this.ajax_queue_length == 0){
      this.$s3_upload_form.remove();
    }
  }
})

thin_man.s3UploadOnly = thin_man.AjaxFormSubmission.extend({
  init: function($form,file,s3_upload){
    this.$form = $form
    this.file = file
    this.file_slug = convertToSlug(this.file.name)
    this.s3_upload = s3_upload;
    this.$local_fields = this.$form.find('[data-local-field]');
    this.$local_fields.detach();
    var new_uuid = new UUID;
    this.uniq_id = new_uuid.value;
    this._super($form);    
  },
  getData: function(){
    var $key_field = this.$form.find('input[name="key"]:last')
    $key_field.val($key_field.val() + this.uniq_id + '/' + this.file_slug)
    var $file_field = this.$form.find('input[type="file"]:first')
    $file_field.attr('name','file')
    $file_field.removeAttr('multiple')
    return new FormData(this.$form[0])
  },
  ajaxSuccess: function(data,textStatus,jqXHR){
    this.$form.attr('action',this.$form.data('local-url'));
    var $s3_fields = this.$form.find('[data-sthree-fields]');
    $s3_fields.remove();
    this.$form.append(this.$local_fields);
    var $new_file_uniq_id = $('<input type="hidden" name="location_photo[uuid]" value="' + this.uniq_id + '">')
    var $new_file_name = $('<input type="hidden" name="new_file_name" value="' + this.file_slug + '">')
    var $csrf_token = $('meta[name=csrf-token]').attr('content')
    this.$form.append($new_file_uniq_id)
    this.$form.append($new_file_name)
    this.$form.prepend("<input type='hidden' name='authenticity_token' value='" + $csrf_token + "'>")
    new thin_man.AjaxFormSubmission(this.$form);
  }  
})
thin_man.s3UploadSingle = thin_man.AjaxFormSubmission.extend({
  init: function($form,file,s3_upload){
    this.$form = $form;
    this.file = file;
    this.file_slug = convertToSlug(this.file.name);
    this.s3_upload = s3_upload;
    this.base_target = this.$form.data('progress-target');
    this.$base_target = $(this.base_target);
    this.actual_progress_target_id = this.base_target + this.file_slug;
    if(this.actual_progress_target_id.substr(0,1) == '#'){ this.actual_progress_target_id = this.actual_progress_target_id.slice(1)}
    this.actual_progress_target_id = this.actual_progress_target_id.substr(0,this.actual_progress_target_id.indexOf('.'));
    this.$actual_progress_target = $('<div class="ih-row" id="' + this.actual_progress_target_id + '">' + this.file.name + ' <progress max="1" value="0"></progress></div>');
    this.$base_target.append(this.$actual_progress_target);
    this.$form.data('progress-target', '#' + this.actual_progress_target_id );
    this.$local_fields = this.$form.find('[data-local-field]');
    this.$local_fields.detach();
    var new_uuid = new UUID;
    this.uniq_id = new_uuid.value;
    this._super($form);
  },
  getData: function(){
    var $key_field = this.$form.find('input[name="key"]:last')
    s3_upload_single = this;
    $key_field.val($key_field.val() + s3_upload_single.uniq_id + '/' + s3_upload_single.file_slug)
    var form_data = new FormData();
    var form_obj = arrayToObject(this.$form.serializeArray());
    $.each(form_obj, function(name,value){
      form_data.append(name, value);
    })
    form_data.append('file',this.file);
    return form_data;
  },
  ajaxSuccess: function(data,textStatus,jqXHR){
    this.$form.attr('action',this.$form.data('local-url'));
    var $s3_fields = this.$form.find('[data-sthree-fields]');
    $s3_fields.remove();
    this.$form.append(this.$local_fields);
    var $new_file_uniq_id = $('<input type="hidden" name="location_photo[uuid]" value="' + this.uniq_id + '">')
    var $new_file_name = $('<input type="hidden" name="new_file_name" value="' + this.file_slug + '">')
    var $csrf_token = $('meta[name=csrf-token]').attr('content')
    this.$form.append($new_file_uniq_id)
    this.$form.append($new_file_name)
    this.$form.prepend("<input type='hidden' name='authenticity_token' value='" + $csrf_token + "'>")
    new thin_man.AjaxFormSubmission(this.$form);
    this.s3_upload.completeOne();
  },
  customXHR: function(){
    var xhr = $.ajaxSettings.xhr();
    if(xhr.upload){
      var thin_man_obj = this.thin_man_obj;
      xhr.upload.addEventListener('progress',
        function(e){
          if(e.lengthComputable){
            var progress_bar = thin_man_obj.progress_target.find('progress');
            progress_bar.attr('max',e.total);
            progress_bar.attr('value',e.loaded);
          }
        },
        false);
      xhr.upload.addEventListener('load',
        function(e){
          thin_man_obj.progress_target.remove();
        }
      );
      xhr.upload.addEventListener('abort',
        function(e){
          thin_man_obj.progress_target.remove();
        }
      );
      xhr.upload.addEventListener('error',
        function(e){
          thin_man_obj.progress_target.html("There was an error upoading this file.");
        }
      );

    }
    return xhr;
  }
})

/*google cloud*/
thin_man.googleCloudUpload = Class.extend({
  init: function($gcloud_upload_form){
    this.upload_style = thin_man.getUploadStyle()
    this.$gcloud_upload_form = $gcloud_upload_form;
    var gcloud_upload = this;
    this.$file_fields = this.$gcloud_upload_form.find('input[type="file"]');
    this.$file_fields.detach()
    if(this.$file_fields[0].files.length == 0){
      this.sendWithoutFile()
      return true
    } else {
      this.getPresignedUrls()
    }
  },
  getPresignedUrls: function(){
    var presigned_forms_path = this.$gcloud_upload_form.data('presigned-forms-path')
    var gcloud_upload = this;
    this.filenames = {}
    $.each(this.$file_fields[0].files,function(){
      var filename = this.name
      gcloud_upload.filenames[filename] = this
    })
    $.post(presigned_forms_path, {filenames: Object.keys(gcloud_upload.filenames)}, function(data){
      gcloud_upload.presigned_posts = data
      gcloud_upload.beginUpload()
    })
  },
  beginUpload: function(){
    if('single_file' == this.upload_style){
      this.fireOnlyFile()
    } else if('multiple_file' == this.upload_style){
      this.fireMultipleFiles()
    }
  },
  sendWithoutFile: function(){
    this.$gcloud_upload_form.attr('action',this.$gcloud_upload_form.data('local-url'));
    var $gcloud_fields = this.$gcloud_upload_form.find('[data-sthree-fields]');
    var $csrf_token = $('meta[name=csrf-token]').attr('content')
    $gcloud_fields.remove();
    this.$gcloud_upload_form.prepend("<input type='hidden' name='authenticity_token' value='" + $csrf_token + "'>")
    new thin_man.AjaxFormSubmission(this.$gcloud_upload_form);
  },
  fireOnlyFile: function(){
    var file = this.$file_fields[0].files[0]
    new thin_man.googleCloudUploadOnly(file,this);
  },
  fireMultipleFiles: function(){
      this.ajax_queue_length = 0;
      this.file_queue = [];
      var gcloud_upload = this
      this.$file_fields.each(function(){
        $.each(this.files, function(index,file){
          gcloud_upload.file_queue.push(file);
        })
      })
      var i = -1;
      while(++i < 3){ //Start off 3 uploads. The others will be chained as these complete.
        if(this.file_queue.length > 0){
          gcloud_upload.fireOne(this.file_queue.shift());
        }
      }

  },
  fireOne: function(file){
    new thin_man.googleCloudUploadSingle(file,this);
    this.ajax_queue_length += 1;
  },
  completeOne: function(){
    this.ajax_queue_length -= 1;
    if(this.ajax_queue_length < 3){
      if(this.file_queue.length > 0){
        try{ // This could fail due to a race condition emptying the array. If so, we're done, don't throw an error
          var next_file = this.file_queue.shift();
          this.fireOne(next_file);
        } catch(e){}
      }
    }
  }
})
thin_man.googleCloudUploadOnly = thin_man.AjaxFormSubmission.extend({
  init: function(file,gcloud_upload){
    this.gcloud_upload = gcloud_upload;
    this.presigned = gcloud_upload.presigned_posts[file.name]
    this.$form = $('<form>')
    this.$form.attr('action',this.presigned.url)
    this.file = file
    this._super(this.$form);    
  },
  getData: function(){
    var form_data = new FormData();
    $.each(this.presigned.fields, function(name,value){
      form_data.append(name, value);
    })
    form_data.append('file',this.file);
    return form_data;
  },
  ajaxSuccess: function(data,textStatus,jqXHR){
    this.$form = this.gcloud_upload.$gcloud_upload_form
    var $new_file_uniq_id = $('<input type="hidden" name="location_photo[uuid]" value="' + this.presigned.uuid + '">')
    var $new_file_name = $('<input type="hidden" name="new_file_name" value="' + this.file.name + '">')
    var $csrf_token = $('meta[name=csrf-token]').attr('content')
    this.$form.append($new_file_uniq_id)
    this.$form.append($new_file_name)
    this.$form.prepend("<input type='hidden' name='authenticity_token' value='" + $csrf_token + "'>")
    new thin_man.AjaxFormSubmission(this.$form);
  },
  ajaxError: function(jqXHR){
    jqXHR
  }
})
thin_man.googleCloudUploadSingle = thin_man.AjaxFormSubmission.extend({
  init: function(file,gcloud_upload){
    this.gcloud_upload = gcloud_upload;
    this.presigned = gcloud_upload.presigned_posts[file.name]
    this.$form = $('<form>')
    this.$form.attr('action',this.presigned.url)
    this.file = file;
    this.initProgressBars()
    this._super(this.$form);
  },
  initProgressBars: function(){
    this.base_target = this.$form.data('progress-target');
    this.$base_target = $(this.base_target);
    this.actual_progress_target_id = this.base_target + this.file.name;
    if(this.actual_progress_target_id.substr(0,1) == '#'){ this.actual_progress_target_id = this.actual_progress_target_id.slice(1)}
    this.actual_progress_target_id = this.actual_progress_target_id.substr(0,this.actual_progress_target_id.indexOf('.'));
    this.$actual_progress_target = $('<div class="ih-row" id="' + this.actual_progress_target_id + '">' + this.file.name + ' <progress max="1" value="0"></progress></div>');
    this.$base_target.append(this.$actual_progress_target);
    this.$form.data('progress-target', '#' + this.actual_progress_target_id );
  },
  getData: function(){
    var form_data = new FormData();
    $.each(this.presigned.fields, function(name,value){
      form_data.append(name, value);
    })
    form_data.append('file',this.file);
    return form_data;
  },
  ajaxSuccess: function(data,textStatus,jqXHR){
    this.$form = this.gcloud_upload.$gcloud_upload_form
    var $new_file_uniq_id = $('<input type="hidden" name="location_photo[uuid]" value="' + this.presigned.uuid + '">')
    var $new_file_name = $('<input type="hidden" name="new_file_name" value="' + this.file.name + '">')
    var $csrf_token = $('meta[name=csrf-token]').attr('content')
    this.$form.append($new_file_uniq_id)
    this.$form.append($new_file_name)
    this.$form.prepend("<input type='hidden' name='authenticity_token' value='" + $csrf_token + "'>")
    new thin_man.AjaxFormSubmission(this.$form);
    this.gcloud_upload.completeOne();
  }//,
  // customXHR: function(){
  //   var xhr = new window.XMLHttpRequest();
  //   if(xhr.upload){
  //     var thin_man_obj = this.thin_man_obj;
  //     xhr.upload.addEventListener('progress',
  //       function(e){
  //         if(e.lengthComputable){
  //           var progress_bar = thin_man_obj.progress_target.find('progress');
  //           progress_bar.attr('max',e.total);
  //           progress_bar.attr('value',e.loaded);
  //         }
  //       },
  //       false);
  //     xhr.upload.addEventListener('load',
  //       function(e){
  //         thin_man_obj.progress_target.remove();
  //       }
  //     );
  //     xhr.upload.addEventListener('abort',
  //       function(e){
  //         thin_man_obj.progress_target.remove();
  //       }
  //     );
  //     xhr.upload.addEventListener('error',
  //       function(e){
  //         thin_man_obj.progress_target.html("There was an error upoading this file.");
  //       }
  //     );
  //   }
  //   return xhr;
  // }
})
*/