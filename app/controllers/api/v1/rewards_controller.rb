class Api::V1::RewardsController < Api::V1::ApplicationController
	protect_from_forgery with: :null_session

	def costumer_request
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

		render json: { "message": "reward requested" }
	end

	def redeem
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

		render json: { "message": "reward redeemed" }
	end

  def costumer_requests
    render json: { "costumer_requests": RewardRequest.all }
  end

end
