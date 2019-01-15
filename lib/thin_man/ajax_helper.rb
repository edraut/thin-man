module ThinMan
  module AjaxHelper
    def ajax_link(name, options, html_options, target,
      sub_class: nil, insert_method: nil, empty_on_success: nil, remove_on_success: nil,
      http_method: nil, no_mouse_click: nil, progress_target: nil,
      mask_target: nil, mask_message: nil, replacement_path: nil, push_path: nil,
      progress_color: nil, scroll_to: nil, scroll_center: nil)
      ajax_options = {
        'data-ajax-link' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-ajax-method' => http_method) if http_method.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      ajax_options.merge!('data-remove-on-success' => remove_on_success) if remove_on_success.present?
      ajax_options.merge!('data-no-mouse-click' => no_mouse_click) if no_mouse_click.present?
      ajax_options.merge!('data-progress-target' => progress_target) if progress_target.present?
      ajax_options.merge!('data-progress-color' => progress_color) if progress_color.present?
      ajax_options.merge!('data-mask-target' => mask_target) if mask_target.present?
      ajax_options.merge!('data-mask-message' => mask_message) if mask_message.present?
      ajax_options.merge!('data-scroll-to' => scroll_to) if scroll_to.present?
      ajax_options.merge!('data-scroll-center' => true) if scroll_center.present?
      ajax_options.merge!('data-replacement-path' => replacement_path) if replacement_path.present?
      ajax_options.merge!('data-push-path' => push_path) if push_path.present?
      link_to(name,
              options,
              html_options.merge(ajax_options))
    end

    def ajax_link_now(name, options, html_options, target,
      sub_class: nil, insert_method: nil, empty_on_success: nil, remove_on_success: nil,
      http_method: nil, no_mouse_click: nil, progress_target: nil,
      progress_color: nil, mask_target: nil, mask_message: nil,
      sequence_group: nil, sequence_number: nil, replacement_path: nil, push_path: nil,
      search_path: nil, search_params: nil, scroll_to: nil, scroll_center: nil)
      ajax_options = {
        'data-ajax-link-now' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-ajax-method' => http_method) if http_method.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      ajax_options.merge!('data-remove-on-success' => remove_on_success) if remove_on_success.present?
      ajax_options.merge!('data-no-mouse-click' => no_mouse_click) if no_mouse_click.present?
      ajax_options.merge!('data-progress-target' => progress_target) if progress_target.present?
      ajax_options.merge!('data-progress-color' => progress_color) if progress_color.present?
      ajax_options.merge!('data-mask-target' => mask_target) if mask_target.present?
      ajax_options.merge!('data-mask-message' => mask_message) if mask_message.present?
      ajax_options.merge!('data-sequence-group' => sequence_group) if sequence_group.present?
      ajax_options.merge!('data-sequence-number' => sequence_number) if sequence_number.present?
      ajax_options.merge!('data-search-path' => search_path) if search_path.present?
      ajax_options.merge!('data-search-params' => search_params) if search_params.present?
      ajax_options.merge!('data-scroll-to' => scroll_to) if scroll_to.present?
      ajax_options.merge!('data-scroll-center' => true) if scroll_center.present?
      ajax_options.merge!('data-replacement-path' => replacement_path) if replacement_path.present?
      ajax_options.merge!('data-push-path' => push_path) if push_path.present?

      a_tag = link_to(name,
                options,
                html_options.merge(ajax_options))
      if(search_path.present?)
        href_attr = a_tag.scan(/href="[^"]*/).first
        href_end_index = a_tag.index(href_attr) + href_attr.length
        a_tag.insert(href_end_index,"#!#{target}")
      end
      a_tag
    end

    def ajax_delete(name, options, html_options, target, sub_class: nil, replace_response: false, no_confirm: false, custom_progress: nil, no_mouse_click: nil)
      ajax_options = {
        'data-ajax-delete' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-replace-response' => true) if replace_response
      ajax_options.merge!('data-no-confirm' => true) if no_confirm
      ajax_options.merge!('data-custom-progress' => custom_progress) if custom_progress.present?
      ajax_options.merge!('data-no-mouse-click' => no_mouse_click) if no_mouse_click.present?
      link_to(name,
              options,
              html_options.merge(ajax_options))
    end

    def ajax_form_hash(target, sub_class: nil, insert_method: nil,
      error_target: nil, empty_on_success: nil, reset_on_success: nil, remove_on_success: nil,
      container: nil, custom_progress: nil, no_mouse_click: nil,
      mask_target: nil, mask_message: nil, scroll_to: nil, scroll_center: nil, replacement_path: nil, push_path: nil,
      progress_target: nil, progress_color: nil)
      ajax_options = {
        'data-ajax-form' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-container' => container) if container.present?
      ajax_options.merge!('data-error-target' => error_target) if error_target.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      ajax_options.merge!('data-remove-on-success' => remove_on_success) if remove_on_success.present?
      ajax_options.merge!('data-reset-on-success' => reset_on_success) if reset_on_success.present?
      ajax_options.merge!('data-custom-progress' => custom_progress) if custom_progress.present?
      ajax_options.merge!('data-no-mouse-click' => no_mouse_click) if no_mouse_click.present?
      ajax_options.merge!('data-progress-target' => progress_target) if progress_target.present?
      ajax_options.merge!('data-progress-color' => progress_color) if progress_color.present?
      ajax_options.merge!('data-mask-target' => mask_target) if mask_target.present?
      ajax_options.merge!('data-mask-message' => mask_message) if mask_message.present?
      ajax_options.merge!('data-scroll-to' => scroll_to) if scroll_to.present?
      ajax_options.merge!('data-scroll-center' => true) if scroll_center.present?
      ajax_options.merge!('data-replacement-path' => replacement_path) if replacement_path.present?
      ajax_options.merge!('data-push-path' => push_path) if push_path.present?
      ajax_options
    end

    def ajax_form_now(target, sub_class: nil,
      insert_method: nil, error_target: nil,
      empty_on_success: nil, reset_on_success: nil, remove_on_success: nil,
      container: nil, custom_progress: nil,
      mask_target: nil, mask_message: nil, replacement_path: nil, push_path: nil,
      progress_target: nil, progress_color: nil)
      ajax_options = {
        'data-ajax-form-now' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-container' => container) if container.present?
      ajax_options.merge!('data-error-target' => error_target) if error_target.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      ajax_options.merge!('data-remove-on-success' => remove_on_success) if remove_on_success.present?
      ajax_options.merge!('data-reset-on-success' => reset_on_success) if reset_on_success.present?
      ajax_options.merge!('data-custom-progress' => custom_progress) if custom_progress.present?
      ajax_options.merge!('data-progress-target' => progress_target) if progress_target.present?
      ajax_options.merge!('data-progress-color' => progress_color) if progress_color.present?
      ajax_options.merge!('data-mask-target' => mask_target) if mask_target.present?
      ajax_options.merge!('data-mask-message' => mask_message) if mask_message.present?
      ajax_options.merge!('data-replacement-path' => replacement_path) if replacement_path.present?
      ajax_options.merge!('data-push-path' => push_path) if push_path.present?
      ajax_options
    end

    def ajax_form_attrs(target, sub_class: nil,
      insert_method: nil, error_target: nil, remove_on_success: nil,
      empty_on_success: nil, reset_on_success: nil, no_mouse_click: nil,
      progress_target: nil, progress_color: nil, scroll_to: nil, scroll_center: nil, replacement_path: nil, push_path: nil,
      mask_target: nil, mask_message: nil )
      data_attrs = "data-ajax-form=true data-ajax-target=#{target}"
      data_attrs += " data-insert-method=#{insert_method}" if insert_method
      data_attrs += " data-sub-type=#{sub_class}" if sub_class
      data_attrs += " data-empty-on-success=#{empty_on_success}" if empty_on_success
      data_attrs += " data-remove-on-success=#{remove_on_success}" if remove_on_success
      data_attrs += " data-reset-on-success=#{reset_on_success}" if reset_on_success
      data_attrs += " data-error-target=#{error_target}" if error_target
      data_attrs += " data-no-mouse-click=#{no_mouse_click}" if no_mouse_click
      data_attrs += " data-progress-target=#{progress_target}" if progress_target
      data_attrs += " data-progress-color=#{progress_color}" if progress_color
      data_attrs += " data-mask-target=#{mask_target}" if mask_target
      data_attrs += " data-mask-message=#{mask_message}" if mask_message
      data_attrs += " data-scroll-to=#{scroll_to}" if scroll_to
      data_attrs += " data-scroll-center=true" if scroll_center
      data_attrs += " data-replacement-path=#{replacement_path}" if replacement_path
      data_attrs += " data-push-path=#{push_path}" if push_path
      data_attrs
    end

    def ajax_form_now_attrs(target, sub_class: nil,
      insert_method: nil, error_target: nil,
      empty_on_success: nil, reset_on_success: nil, remove_on_success: nil,
      progress_target: nil, progress_color: nil, replacement_path: nil, push_path: nil,
      mask_target: nil, mask_message: nil )
      data_attrs = "data-ajax-form-now=true data-ajax-target=#{target}"
      data_attrs += " data-insert-method=#{insert_method}" if insert_method
      data_attrs += " data-sub-type=#{sub_class}" if sub_class
      data_attrs += " data-empty-on-success=#{empty_on_success}" if empty_on_success
      data_attrs += " data-remove-on-success=#{remove_on_success}" if remove_on_success
      data_attrs += " data-reset-on-success=#{reset_on_success}" if reset_on_success
      data_attrs += " data-error-target=#{error_target}" if error_target
      data_attrs += " data-progress-target=#{progress_target}" if progress_target
      data_attrs += " data-progress-color=#{progress_color}" if progress_color
      data_attrs += " data-mask-target=#{mask_target}" if mask_target
      data_attrs += " data-mask-message=#{mask_message}" if mask_message
      data_attrs += " data-replacement-path=#{replacement_path}" if replacement_path
      data_attrs += " data-push-path=#{push_path}" if push_path
      data_attrs
    end

    def ajax_link_attrs(target,
      insert_method: nil, sub_type: nil, empty_on_success: nil, remove_on_success: nil,
      http_method: nil, no_mouse_click: nil, progress_target: nil,
      progress_color: nil, replacement_path: nil, push_path: nil,
      mask_target: nil, mask_message: nil,
      scroll_to: nil, scroll_center: nil)
      data_attrs = "data-ajax-link=true data-ajax-target=#{target}"
      data_attrs += " data-insert-method=#{insert_method}" if insert_method
      data_attrs += " data-ajax-method=#{http_method}" if http_method
      data_attrs += " data-sub-type=#{sub_type}" if sub_type
      data_attrs += " data-empty-on-success=#{empty_on_success}" if empty_on_success
      data_attrs += " data-remove-on-success=#{remove_on_success}" if remove_on_success
      data_attrs += " data-no-mouse-click=#{no_mouse_click}" if no_mouse_click
      data_attrs += " data-progress-target=#{progress_target}" if progress_target
      data_attrs += " data-progress-color=#{progress_color}" if progress_color
      data_attrs += " data-scroll-to=#{scroll_to}" if scroll_to
      data_attrs += " data-scroll-center=true" if scroll_center
      data_attrs += " data-mask-target=#{mask_target}" if mask_target
      data_attrs += " data-mask-message=#{mask_message}" if mask_message
      data_attrs += " data-replacement-path=#{replacement_path}" if replacement_path
      data_attrs += " data-push-path=#{push_path}" if push_path
      data_attrs
    end

    def ajax_link_hash(target,
      insert_method: nil, sub_type: nil, empty_on_success: nil, remove_on_success: nil,
      http_method: nil, no_mouse_click: nil, progress_target: nil,
      progress_color: nil, replacement_path: nil, push_path: nil,
      mask_target: nil, mask_message: nil,
      scroll_to: nil, scroll_center: nil)
      ajax_options = {
        'data-ajax-link' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-ajax-method' => http_method) if http_method.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      ajax_options.merge!('data-remove-on-success' => remove_on_success) if remove_on_success.present?
      ajax_options.merge!('data-no-mouse-click' => no_mouse_click) if no_mouse_click.present?
      ajax_options.merge!('data-progress-target' => progress_target) if progress_target.present?
      ajax_options.merge!('data-progress-color' => progress_color) if progress_color.present?
      ajax_options.merge!('data-mask-target' => mask_target) if mask_target.present?
      ajax_options.merge!('data-mask-message' => mask_message) if mask_message.present?
      ajax_options.merge!('data-scroll-to' => scroll_to) if scroll_to.present?
      ajax_options.merge!('data-scroll-center' => true) if scroll_center.present?
      ajax_options.merge!('data-replacement-path' => replacement_path) if replacement_path.present?
      ajax_options.merge!('data-push-path' => push_path) if push_path.present?
      ajax_options
    end

    def dom_target(resource, label = nil)
      '#' + dom_id(resource, label)
    end
  end
end
