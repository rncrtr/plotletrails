class Col < ActiveRecord::Base
  attr_accessible :ord, :plot_id, :title
  belongs_to :plot
  default_scope :order => "ord"
end
