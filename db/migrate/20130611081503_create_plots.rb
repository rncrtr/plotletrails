class CreatePlots < ActiveRecord::Migration
  def change
    create_table :plots do |t|
      t.integer :user_id
      t.string :title
      t.string :desc

      t.timestamps
    end
  end
end
