Rails.application.routes.draw do
  resources :rewards
  devise_for :users
  resources :businesses
  resources :homes
  get 'home/index'

  root :to => "businesses#index"

	namespace :api, defaults: { format: :json } do
		  namespace :v1 do
		    devise_for :users, controllers: { registrations: 'api/v1/registrations', sessions: 'api/v1/sessions'}

		    resource :users do
		      member do
		        get :get_businesses
		        get :get_rewards
		        get :session_check
		      end
		    end

		    resource :klopps do
		      member do
		        post :costumer_request
		        post :redeem
		        post :reject_request
		        get :costumer_requests
		        get :log
		      end
		    end

		    resource :rewards do
		      member do
		        post :costumer_request
		        post :redeem
		        post :reject_request
		        get :costumer_requests
		        get :log
		      end
		    end

		    resource :stats do
		      member do
		        get :top_users
		      end
		    end

		  end
	end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
