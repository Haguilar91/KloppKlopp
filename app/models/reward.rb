class Reward < ApplicationRecord
  belongs_to :business
  mount_uploader :image, FileUploader

  has_many :reward_requests
  has_many :reward_logs
end
