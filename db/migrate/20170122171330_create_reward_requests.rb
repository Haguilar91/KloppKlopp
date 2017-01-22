class CreateRewardRequests < ActiveRecord::Migration[5.0]
  def change
    create_table :reward_requests do |t|
      t.integer :user_id
      t.integer :reward_id
      t.string :state

      t.timestamps
    end
  end
end
