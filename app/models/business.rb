class Business < ApplicationRecord
  has_many :rewards
  mount_uploader :image, FileUploader
end
