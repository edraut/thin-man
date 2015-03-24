module ThinMan
  module AjaxHelper
    def ajax_link(name, options, html_options, target, sub_class: nil, insert_method: nil, empty_on_success: nil)
      ajax_options = {
        'data-ajax-link' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      link_to(name,
              options,
              html_options.merge(ajax_options))
    end

    def ajax_delete(name, options, html_options, target, sub_class: nil)
      ajax_options = {
        'data-ajax-delete' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      link_to(name,
              options,
              html_options.merge(ajax_options))
    end

    def ajax_form_hash(target, sub_class: nil, insert_method: nil, error_target: nil, empty_on_success: nil)
      ajax_options = {
        'data-ajax-form' => true,
        'data-ajax-target' => target
      }
      ajax_options.merge!('data-insert-method' => insert_method) if insert_method.present?
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options.merge!('data-error-target' => error_target) if error_target.present?
      ajax_options.merge!('data-empty-on-success' => empty_on_success) if empty_on_success.present?
      ajax_options
    end

    def ajax_form_attrs(target, sub_class: nil, insert_method: nil, error_target: nil, empty_on_success: nil)
      data_attrs = "data-ajax-form=true data-ajax-target=#{target}"
      data_attrs += " data-insert-method=#{insert_method}" if insert_method
      data_attrs += " data-sub-type=#{sub_class}" if sub_class
      data_attrs += " data-empty-on-success=#{empty_on_success}" if empty_on_success
      data_attrs += " data-error-target=#{error_target}" if error_target
      data_attrs
    end

    def ajax_link_attrs(target, insert_method: nil, sub_type: nil, empty_on_success: nil)
      data_attrs = "data-ajax-link=true data-ajax-target=#{target}"
      data_attrs += " data-insert-method=#{insert_method}" if insert_method
      data_attrs += " data-sub-type=#{sub_type}" if sub_type
      data_attrs += " data-empty-on-success=#{empty_on_success}" if empty_on_success
      data_attrs
    end

    def dom_target(resource)
      '#' + dom_id(resource)
    end
  end
end