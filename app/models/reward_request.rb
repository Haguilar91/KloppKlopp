class RewardRequest < ApplicationRecord
  belongs_to :user
  belongs_to :reward
end
