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

	  business.klopp_logs.group(:user_id).sum(:klopps).each do |klopp_log|
	    users.push({ user: User.find_by_id(klopp_log.first), klopps: klopp_log.second })
	  end

    render json: { "users": users }
	end

	def top_rewards
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

    rewards = []

	  business.reward_logs.group(:user_id).count(:reward_id).each do |reward_stat|
	    rewards.push({ reward: Reward.find_by_id(reward_stat.first), count: reward_stat.second })
	  end

    render json: { "rewards": rewards }
	end

end
