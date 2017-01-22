class CreateKloppRequests < ActiveRecord::Migration[5.0]
  def change
    create_table :klopp_requests do |t|
      t.integer :user_id
      t.integer :business_id
      t.string :state

      t.timestamps
    end
  end
end
