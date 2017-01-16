class CreateRewards < ActiveRecord::Migration[5.0]
  def change
    create_table :rewards do |t|
      t.string :name
      t.integer :business_id
      t.integer :klopps
      t.string :image
      t.boolean :is_active

      t.timestamps
    end
  end
end
