class AddIsActiveToBusiness < ActiveRecord::Migration[5.0]
  def change
    add_column :businesses, :is_active, :string
  end
end
