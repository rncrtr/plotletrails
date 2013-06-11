class CreateCols < ActiveRecord::Migration
  def change
    create_table :cols do |t|
      t.integer :plot_id
      t.string :title
      t.integer :ord

      t.timestamps
    end
  end
end
