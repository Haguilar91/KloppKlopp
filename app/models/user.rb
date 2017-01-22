class User < ApplicationRecord
  acts_as_token_authenticatable
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  belongs_to :business
  has_many :klop_requests
  has_many :reward_requests
  has_many :klopp_logs
  has_many :reward_logs
  has_many :user_klopps
end
