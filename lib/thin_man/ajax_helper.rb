module ThinMan
  module AjaxHelper
    def ajax_link(name, options, html_options, target, sub_class: nil, insert_method: nil, empty_on_success: nil, http_method: nil, no_mouse_click: nil)
      ajax_options = {
        'data-ajax-link' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-ajax-method' => http_method) if http_method.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      ajax_options.merge!('data-no-mouse-click' => no_mouse_click) if no_mouse_click.present?
      link_to(name,
              options,
              html_options.merge(ajax_options))
    end

    def ajax_link_now(name, options, html_options, target, sub_class: nil, insert_method: nil, empty_on_success: nil, http_method: nil)
      ajax_options = {
        'data-ajax-link-now' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-ajax-method' => http_method) if http_method.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      link_to(name,
              options,
              html_options.merge(ajax_options))
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

    def ajax_form_hash(target, sub_class: nil, insert_method: nil, error_target: nil, empty_on_success: nil, reset_on_success: nil, container: nil, custom_progress: nil, no_mouse_click: nil)
      ajax_options = {
        'data-ajax-form' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-container' => container) if container.present?
      ajax_options.merge!('data-error-target' => error_target) if error_target.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      ajax_options.merge!('data-reset-on-success' => reset_on_success) if reset_on_success.present?
      ajax_options.merge!('data-custom-progress' => custom_progress) if custom_progress.present?
      ajax_options.merge!('data-no-mouse-click' => no_mouse_click) if no_mouse_click.present?
      ajax_options
    end

    def ajax_form_attrs(target, sub_class: nil, insert_method: nil, error_target: nil, empty_on_success: nil, reset_on_success: nil, no_mouse_click: nil)
      data_attrs = "data-ajax-form=true data-ajax-target=#{target}"
      data_attrs += " data-insert-method=#{insert_method}" if insert_method
      data_attrs += " data-sub-type=#{sub_class}" if sub_class
      data_attrs += " data-empty-on-success=#{empty_on_success}" if empty_on_success
      data_attrs += " data-reset-on-success=#{reset_on_success}" if reset_on_success
      data_attrs += " data-error-target=#{error_target}" if error_target
      data_attrs += " data-no-mouse-click=#{no_mouse_click}" if no_mouse_click
      data_attrs
    end

    def ajax_link_attrs(target, insert_method: nil, sub_type: nil, empty_on_success: nil, http_method: nil, no_mouse_click: nil)
      data_attrs = "data-ajax-link=true data-ajax-target=#{target}"
      data_attrs += " data-insert-method=#{insert_method}" if insert_method
      data_attrs += " data-ajax-method=#{http_method}" if http_method
      data_attrs += " data-sub-type=#{sub_type}" if sub_type
      data_attrs += " data-empty-on-success=#{empty_on_success}" if empty_on_success
      data_attrs += " data-no-mouse-click=#{no_mouse_click}" if no_mouse_click
      data_attrs
    end

    def dom_target(resource, label = nil)
      '#' + dom_id(resource, label)
    end
  end
end
