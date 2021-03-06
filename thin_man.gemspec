$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "thin_man/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "thin_man"
  s.version     = ThinMan::VERSION
  s.authors     = ["Eric Draut, Adam Bialek"]
  s.email       = ["edraut@gmail.com, abialek@gmail.com"]
  s.homepage    = "https://github.com/edraut/thin-man/wiki"
  s.summary     = "A Rails library that makes web apps lively while keeping all the logic on the server. "
  s.description = "A Rails library that makes web apps lively while keeping all the logic on the server. "
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/dummy/*", "test/javascript/spec/*", "test/javascript/*", "test/*"]

  s.add_dependency "rails", ">= 5.1", "< 6"

  s.add_development_dependency "sqlite3", "~> 1"
  s.add_development_dependency "minitest-rails", ">= 3", "< 4"
  s.add_development_dependency "rake"
end
