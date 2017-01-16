class Reward < ApplicationRecord
  belongs_to :business
  mount_uploader :image, FileUploader
end
