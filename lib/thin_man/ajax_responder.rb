module ThinMan
  module AjaxResponder
    def render_ajax(options)
      render({partial: action_name}.merge(options))
    end
  end
end
