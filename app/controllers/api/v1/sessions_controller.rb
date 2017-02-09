class Api::V1::SessionsController < Devise::SessionsController
    skip_before_action :verify_signed_out_user, only: [:destroy]

    def create
      #user = warden.authenticate!(params[:user])
      user = User.find_by_email(params[:user][:email])
      if !user
	      respond_to do |format|
  	      format.json do
		         render json: {
		           status: :unprocessable_entity,
		           error: "User does not exists"
		         }
	        end
  	    end
        return
      end

      if user.valid_password?(params[:user][:password]) == false
	      respond_to do |format|
  	      format.json do
		         render json: {
		           status: :unprocessable_entity,
		           error: "Incorrect password"
		         }
	        end
  	    end
        return
      end
      sign_in(resource_name, user)

      current_user.authentication_token = nil
      current_user.save

      respond_to do |format|
        format.json do
          render json: {
            user: current_user,
            status: :ok,
            authentication_token: current_user.authentication_token,
            business: current_user.business
          }
        end
      end
    end

    def destroy
      respond_to do |format|
        user = User.find_by authentication_token: params[:authentication_token]
        format.json do
          if user
            user.authentication_token = nil
            user.save
            sign_out(user)
            render nothing: true, status: :ok
          else
            render json: nil, status: :unprocessable_entity
          end
        end
      end
    end
end
