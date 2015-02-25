module ThinMan
  module AjaxHelper
    def ajax_link(name, options, html_options, target, sub_class: nil, insert_method: nil)
      sub_class ||= 'true'
      insert_method ||= 'html'
      ajax_options = {
        'data-ajax-link' => true,
        'data-ajax-target' => target,
        'data-insert-method' => insert_method
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      link_to(name,
              options,
              html_options.merge(ajax_options))
    end

    def ajax_form_hash(target, sub_class: nil, insert_method: 'html')
      ajax_options = {
        'data-ajax-form' => true,
        'data-ajax-target' => target,
        'data-insert-method' => insert_method
      }
      ajax_options.merge!('data-sub-type' => sub_class) if sub_class.present?
      ajax_options
    end

    def ajax_link_attrs(target, insert_method: nil, sub_type: nil)
      data_attrs = "data-ajax-link=true data-ajax-target=#{target}"
      data_attrs += " data-insert-method=#{insert_method}" if insert_method
      data_attrs += " data-insert-method=#{sub_type}" if sub_type
      data_attrs
    end

    def dom_target(resource)
      '#' + dom_id(resource)
    end
  end
end
