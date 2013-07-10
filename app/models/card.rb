class Card < ActiveRecord::Base
  attr_accessible :col_id, :color, :ord, :text
  default_scope :order => "ord"
end
