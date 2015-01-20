require 'thin_man/railtie' if defined?(Rails)

module ThinMan

  class Engine < ::Rails::Engine
    isolate_namespace ThinMan
  end


end
