class Api::V1::UsersController < Api::V1::ApplicationController
	protect_from_forgery with: :null_session

	def get_businesses
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    businesses = []
    Business.where(is_active: true).each do |business|
      klopps = 0
      user_klopp = UserKlopp.find_by(user_id: user.id, business_id: business.id)
      if user_klopp
        klopps = user_klopp.klopps
      end
      businesses.push({business: business, klopps: klopps})
    end
    
    render json: { "businesses": businesses }
	end

	def get_rewards

    if !params[:business_id]
      render json: { error: 'business_id param not found' }, status: :unprocessable_entity
      return
    end

    business = Business.find_by_id(params[:business_id])
    render json: { "rewards": business.rewards.where(is_active: true) }
	end

end
