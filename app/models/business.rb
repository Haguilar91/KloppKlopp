class Business < ApplicationRecord
  has_many :rewards
  mount_uploader :image, FileUploader

  has_many :users
  has_many :klopp_requests
  has_many :klopp_logs
  has_many :user_klopps
end
