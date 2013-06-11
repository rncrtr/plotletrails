class Plot < ActiveRecord::Base
  attr_accessible :desc, :title, :user_id
  belongs_to :user
  has_many :cols
end
