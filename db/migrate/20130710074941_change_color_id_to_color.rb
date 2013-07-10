class ChangeColorIdToColor < ActiveRecord::Migration
  def up
  end

  def down
  end

  def change
  	rename_column :cards, :color_id, :color
  	change_column :cards, :color, :string
  end
end
