class CreateKloppLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :klopp_logs do |t|
      t.integer :user_id
      t.integer :business_id
      t.integer :klopps
      t.string :invoice_number

      t.timestamps
    end
  end
end
