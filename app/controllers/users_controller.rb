class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create 
    @user = User.new(params[:user])
    if @user.save
      redirect_to root_url, :notice => "Signed up!"
    else
      render "new"
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.save
      redirect_to @user, notice: "Account updated."
    else
      redirect_to @user, notice: "Account was not updated."
    end
  end

  def destroy
  end
end
