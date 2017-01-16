require 'test_helper'

class RewardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @reward = rewards(:one)
  end

  test "should get index" do
    get rewards_url
    assert_response :success
  end

  test "should get new" do
    get new_reward_url
    assert_response :success
  end

  test "should create reward" do
    assert_difference('Reward.count') do
      post rewards_url, params: { reward: { bussiness_id: @reward.bussiness_id, image: @reward.image, is_active: @reward.is_active, klopps: @reward.klopps, name: @reward.name } }
    end

    assert_redirected_to reward_url(Reward.last)
  end

  test "should show reward" do
    get reward_url(@reward)
    assert_response :success
  end

  test "should get edit" do
    get edit_reward_url(@reward)
    assert_response :success
  end

  test "should update reward" do
    patch reward_url(@reward), params: { reward: { bussiness_id: @reward.bussiness_id, image: @reward.image, is_active: @reward.is_active, klopps: @reward.klopps, name: @reward.name } }
    assert_redirected_to reward_url(@reward)
  end

  test "should destroy reward" do
    assert_difference('Reward.count', -1) do
      delete reward_url(@reward)
    end

    assert_redirected_to rewards_url
  end
end
