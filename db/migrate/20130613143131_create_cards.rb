class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.integer :col_id
      t.string :text
      t.integer :color_id
      t.integer :ord

      t.timestamps
    end
  end
end
