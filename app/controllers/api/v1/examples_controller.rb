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

end
