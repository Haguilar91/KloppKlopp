class CreateUserKlopps < ActiveRecord::Migration[5.0]
  def change
    create_table :user_klopps do |t|
      t.integer :user_id
      t.integer :business_id
      t.integer :klopps

      t.timestamps
    end
  end
end
