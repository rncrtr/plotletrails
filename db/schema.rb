# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130710074941) do

  create_table "cards", :force => true do |t|
    t.integer  "col_id"
    t.string   "text"
    t.string   "color"
    t.integer  "ord"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "colors", :force => true do |t|
    t.string   "name"
    t.string   "hex"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "cols", :force => true do |t|
    t.integer  "plot_id"
    t.string   "title"
    t.integer  "ord"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "plots", :force => true do |t|
    t.integer  "user_id"
    t.string   "title"
    t.string   "desc"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "password_hash"
    t.string   "password_salt"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

end
