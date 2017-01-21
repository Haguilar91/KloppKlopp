class Api::V1::ExamplesController < Api::V1::ApplicationController
	protect_from_forgery with: :null_session

	def action_test
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

		render json: { "message": "controller action successful executed" }
	end

	def get_businesses
    
    render json: { "businesses": Business.all }
	end

	def get_rewards
    business = Business.find_by_id(params[:business_id])
    render json: { "rewards": business.rewards }
	end

end
