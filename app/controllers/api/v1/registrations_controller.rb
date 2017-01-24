class Api::V1::RegistrationsController < Devise::RegistrationsController
    def create
      @user = User.new(user_params)
      if User.exists?(username: @user.username)
        render json: { error: "username already exists" }
        return
      end
      if !@user.username
        render json: { error: "username not found" }
        return
      end
      @user = User.create(user_params)
      if @user.save
        render json: { state: { code: 0 }, data: @user }
      else
        render json: { state: { code: 1, messages: @user.errors.full_messages } }
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
end
