class Api::V1::RegistrationsController < Devise::RegistrationsController
    def create
      @user = User.new(user_params)
      if User.exists?(username: @user.username)
	      respond_to do |format|
  	      format.json do
		         render json: {
		           status: :unprocessable_entity,
		           error: "Username already exists"
		         }
	        end
  	    end
        return
      end
      if !@user.username
	      respond_to do |format|
  	      format.json do
		         render json: {
		           status: :unprocessable_entity,
		           error: "Username param not found"
		         }
	        end
  	    end
        return
      end
      @user = User.create(user_params)
      if @user.save
	      respond_to do |format|
  	      format.json do
		         render json: {
		           status: :ok,
		           data: @user
		         }
	        end
  	    end
      else
	      respond_to do |format|
  	      format.json do
		         render json: {
		           status: :unprocessable_entity,
		           error: @user.errors.full_messages.first
		         }
	        end
  	    end
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
end
