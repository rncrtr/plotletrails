class Card < ActiveRecord::Base
  attr_accessible :col_id, :color_id, :ord, :text
  default_scope :order => "ord"
end
