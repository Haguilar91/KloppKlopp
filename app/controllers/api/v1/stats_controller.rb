class Api::V1::StatsController < Api::V1::ApplicationController
	protect_from_forgery with: :null_session

	def top_users
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    business = user.business

		unless business
		  render json: { error: 'You don\'t manage a business' }, status: :unprocessable_entity
		  return
		end

    users = []

	  KloppLog.where(business_id: 3).group(:user_id).sum(:klopps).each do |klopp_log|
	    users.push({ user: User.find_by_id(klopp_log.first), klopps: klopp_log.second })
	  end

    render json: { "users": users }
	end

end
