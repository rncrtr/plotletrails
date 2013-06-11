source 'https://rubygems.org'
ruby '1.9.3'

gem 'rails', '3.2.13'

#database
group :development,:test do
	gem 'mysql2'
end
group :production do
  gem 'pg'
end

gem 'thin'
gem 'stripe'
gem 'bcrypt-ruby', :require => 'bcrypt'
gem "paperclip", "~> 3.0"
gem 'heroku'
gem 'bootstrap-sass'

group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
end
gem 'jquery-rails'