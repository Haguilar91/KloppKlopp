class Api::V1::RewardsController < Api::V1::ApplicationController
	protect_from_forgery with: :null_session

	def costumer_request
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    if !params[:reward_id]
      render json: { error: 'reward_id param not found' }, status: :unprocessable_entity
      return
    end

    reward = Reward.find_by_id(params[:reward_id].to_i)

		unless reward
		  render json: { error: 'Reward does not exists' }, status: :unprocessable_entity
		  return
		end

    reward_request = RewardRequest.new
    reward_request.user_id = user.id
    reward_request.reward_id = reward.id
    reward_request.state = "pending"
    reward_request.save

		render json: { "message": "reward requested" }
	end

	def redeem
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    if !params[:reward_request_id]
      render json: { error: 'reward_request_id param not found' }, status: :unprocessable_entity
      return
    end

    reward_request = RewardRequest.find_by(state: "pending", id: params[:reward_request_id])

		unless reward_request
		  render json: { error: 'Reward request does not exists' }, status: :unprocessable_entity
		  return
		end

    if reward_request.reward.business_id != user.business_id
      render json: { error: 'you do not have permission to redeem klopps in this business' }, status: :unprocessable_entity
      return
    end

    reward_log = RewardLog.new
    reward_log.user_id = reward_request.user_id
    reward_log.reward_id = reward_request.reward_id
    reward_log.klopps = reward_request.reward.klopps
    reward_log.save

    user_klopp = UserKlopp.find_by(user_id: klopp_request.user_id, business_id: klopp_request.business_id)
    if !user_klopp
      render json: { error: 'you do not have klopps on this business' }, status: :unprocessable_entity
      return
    elsif user_klopp.klopps < reward_request.reward.klopps
      render json: { error: 'you do not have klopps enough business' }, status: :unprocessable_entity
      return
    else
      user_klopp.klopps -= reward_request.reward.klopps
    end

    user_klopp.save

    reward_request.state = "completed"
    reward_request.save

		render json: { "message": "reward redeemed" }
	end

  def reject_request
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    if !params[:reward_request_id]
      render json: { error: 'reward_request_id param not found' }, status: :unprocessable_entity
      return
    end

    reward_request = RewardRequest.find_by_id(params[:reward_request_id])

    if reward_request.request.business_id != user.business_id
      render json: { error: 'you do not have permission to reject requests in this business' }, status: :unprocessable_entity
      return
    end

    reward_request.state = "rejected"
    reward_request.save
    
    render json: { "message": "request rejected" }
  end

  def costumer_requests
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    if !user.business_id
      render json: { error: 'you do not manage a business' }, status: :unprocessable_entity
      return
    end

    costumer_requests = []

    if params[:state] == "completed"
		  user.business.reward_requests.where(state: "completed").each do |costumer_request|
		    user = costumer_request.user
		    user.authentication_token = nil
		    costumer_requests.push({ costumer_request: costumer_request, reward: costumer_request.reward, user: user })
		  end
    elsif params[:state] == "rejected"
		  user.business.reward_requests.where(state: "rejected").each do |costumer_request|
		    user = costumer_request.user
		    user.authentication_token = nil
		    costumer_requests.push({ costumer_request: costumer_request, reward: costumer_request.reward, user: user })
		  end
    elsif params[:state] == "*"
		  user.business.reward_requests.each do |costumer_request|
		    user = costumer_request.user
		    user.authentication_token = nil
		    costumer_requests.push({ costumer_request: costumer_request, reward: costumer_request.reward, user: user })
		  end
    else
		  user.business.reward_requests.where(state: "pending").each do |costumer_request|
		    user = costumer_request.user
		    user.authentication_token = nil
		    costumer_requests.push({ costumer_request: costumer_request, reward: costumer_request.reward, user: user })
		  end
    end

    render json: { "costumer_requests": costumer_requests }
  end

end
