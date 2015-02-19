module ThinMan
  module AjaxHelper
    def ajax_link(name, options, html_options, target, sub_class=nil, insert_method=nil)
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

    def ajax_hash(target, method='html')
      { data: {
        ajax_form: true,
        ajax_target: target,
        insert_method: method } }
    end

    def dom_target(resource)
      '#' + dom_id(resource)
    end
  end
end
