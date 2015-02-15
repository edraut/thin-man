require 'thin_man/ajax_helper'
require 'thin_man/ajax_responder'
module ThinMan
  class Railtie < Rails::Railtie
    initializer "thin_man.ajax_helper" do
      ActionView::Base.send :include, AjaxHelper
    end
    initializer "thin_man.ajax_responder" do
      ActionController::Base.send :include, AjaxResponder
    end
  end
end
