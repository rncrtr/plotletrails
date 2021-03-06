class ColsController < ApplicationController
  # GET /cols
  # GET /cols.json
  def index
    @cols = Col.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @cols }
    end
  end

  # GET /cols/1
  # GET /cols/1.json
  def show
    @col = Col.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @col }
    end
  end

  # GET /cols/new
  # GET /cols/new.json
  def new
    @col = Col.new
    
    respond_to do |format|
      format.html {render :layout => false}
      format.json { render json: @col }
    end
  end

  # GET /cols/1/edit
  def edit
    @col = Col.find(params[:id])
  end

  # POST /cols
  # POST /cols.json
  def create
    @col = Col.new(params[:col])

    respond_to do |format|
      if @col.save
        format.html { render html: @col, layout: "ajax"}
        format.json { render json: @col, status: :created, location: @col }
      else
        format.html { render action: "new" }
        format.json { render json: @col.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /cols/1
  # PUT /cols/1.json
  def update
    @col = Col.find(params[:id])

    respond_to do |format|
      if @col.update_attributes(params[:col])
        format.html { redirect_to @col, notice: 'Col was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @col.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cols/1
  # DELETE /cols/1.json
  def destroy
    @col = Col.find(params[:id])
    @col.destroy

    respond_to do |format|
      format.html { redirect_to cols_url }
      format.json { head :no_content }
    end
  end
end
