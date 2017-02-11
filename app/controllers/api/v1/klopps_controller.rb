class Api::V1::KloppsController < Api::V1::ApplicationController
	protect_from_forgery with: :null_session

	def costumer_request
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    if !params[:business_id]
      render json: { error: 'business_id param not found' }, status: :unprocessable_entity
      return
    end

    business = Business.find_by_id(params[:business_id].to_i)

		unless business
		  render json: { error: 'Business does not exists' }, status: :unprocessable_entity
		  return
		end

    if KloppRequest.find_by(user_id: user.id, business_id: business.id, state: "pending")
		  render json: { error: 'Previous request found' }, status: :unprocessable_entity
		  return
		end

    klopp_request = KloppRequest.new
    klopp_request.user_id = user.id
    klopp_request.business_id = business.id
    klopp_request.state = "pending"
    klopp_request.save

		render json: { "message": "klopps requested" }
	end

	def redeem
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    if !params[:klopps]
      render json: { error: 'klopps param not found' }, status: :unprocessable_entity
      return
    end

    if !params[:invoice_number]
      render json: { error: 'invoice_number param not found' }, status: :unprocessable_entity
      return
    end

    if !params[:klopp_request_id]
      render json: { error: 'klopp_request_id param not found' }, status: :unprocessable_entity
      return
    end

    klopp_request = KloppRequest.find_by(state: "pending", id: params[:klopp_request_id])

		unless klopp_request
		  render json: { error: 'Klopp request does not exists' }, status: :unprocessable_entity
		  return
		end

    if klopp_request.business_id != user.business_id
      render json: { error: 'you do not have permission to redeem klopps in this business' }, status: :unprocessable_entity
      return
    end

    klopp_log = KloppLog.new
    klopp_log.user_id = klopp_request.user_id
    klopp_log.business_id = klopp_request.business_id
    klopp_log.klopps = params[:klopps].to_i
    klopp_log.invoice_number = params[:invoice_number]
    klopp_log.save

    user_klopp = UserKlopp.find_by(user_id: klopp_request.user_id, business_id: klopp_request.business_id)
    if !user_klopp
      user_klopp = UserKlopp.new
      user_klopp.user_id = klopp_request.user_id
      user_klopp.business_id = klopp_request.business_id
      user_klopp.klopps = params[:klopps].to_i
    else
      user_klopp.klopps += params[:klopps].to_i
    end

    user_klopp.save

    klopp_request.state = "completed"
    klopp_request.save

		render json: { "message": "klopps redeemed" }
	end

  def reject_request
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    if !params[:klopp_request_id]
      render json: { error: 'klopp_request_id param not found' }, status: :unprocessable_entity
      return
    end

    klopp_request = KloppRequest.find_by_id(params[:klopp_request_id])

    if klopp_request.business_id != user.business_id
      render json: { error: 'you do not have permission to reject requests in this business' }, status: :unprocessable_entity
      return
    end

    klopp_request.state = "rejected"
    klopp_request.save
    
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
		  user.business.klopp_requests.where(state: "completed").each do |costumer_request|
		    user = costumer_request.user
		    user.authentication_token = nil
		    costumer_requests.push({ costumer_request: costumer_request, user: user })
		  end
    elsif params[:state] == "rejected"
		  user.business.klopp_requests.where(state: "rejected").each do |costumer_request|
		    user = costumer_request.user
		    user.authentication_token = nil
		    costumer_requests.push({ costumer_request: costumer_request, user: user })
		  end
    elsif params[:state] == "*"
      user.business.klopp_requests.each do |costumer_request|
		    user = costumer_request.user
		    user.authentication_token = nil
		    costumer_requests.push({ costumer_request: costumer_request, user: user })
		  end
    else
		  user.business.klopp_requests.where(state: "pending").each do |costumer_request|
		    user = costumer_request.user
		    user.authentication_token = nil
		    costumer_requests.push({ costumer_request: costumer_request, user: user })
		  end
    end

    render json: { "costumer_requests": costumer_requests }
  end

  def log
		user = User.find_by(authentication_token: [params[:user_token]], email: [params[:user_email]])

		unless user
		  render json: { error: 'User does not exists' }, status: :unprocessable_entity
		  return
		end

    if !user.business_id
      render json: { error: 'you do not manage a business' }, status: :unprocessable_entity
      return
    end

    klopp_logs = []

	  user.business.klopp_logs.each do |klopp_log|
	    user = klopp_log.user
	    user.authentication_token = nil
	    klopp_logs.push({ klopp_log: klopp_log, user: user })
	  end

    render json: { "log": klopp_logs }
  end

end
