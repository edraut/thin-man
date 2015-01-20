require 'thin_man/ajax_helper'
module ThinMan
  class Railtie < Rails::Railtie
    initializer "thin_man.ajax_helper" do
      ActionView::Base.send :include, AjaxHelper
    end
  end
end
