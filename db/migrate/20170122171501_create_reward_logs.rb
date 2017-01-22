class CreateRewardLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :reward_logs do |t|
      t.integer :user_id
      t.integer :reward_id
      t.integer :klopps

      t.timestamps
    end
  end
end
