//Người dùng
const { query } = require('../utils/db');
const { sql } = require('mssql');

class User {
  static async findByEmail(email) {
    const users = await query(`
      SELECT * FROM Users 
      WHERE Email = @param0
    `, [email]);
    return users[0];
  }

  static async create(userData) {
    const result = await query(`
      INSERT INTO Users (Email, Password, Name, Phone, Role)
      OUTPUT INSERTED.*
      VALUES (@param0, @param1, @param2, @param3, @param4)
    `, [
      userData.email,
      userData.password,
      userData.name,
      userData.phone,
      userData.role || 'user'
    ]);
    return result[0];
  }

  static async findById(id) {
    const users = await query(`
      SELECT Id, Email, Name, Phone, Role, CreatedAt, UpdatedAt
      FROM Users 
      WHERE Id = @param0
    `, [id]);
    return users[0];
  }

  static async update(id, userData) {
    const result = await query(`
      UPDATE Users
      SET 
        Name = @param1,
        Phone = @param2,
        UpdatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE Id = @param0
    `, [id, userData.name, userData.phone]);
    return result[0];
  }
}

module.exports = User;
//Người dùng
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin", "rescue"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const { query } = require('../utils/db');
const { sql } = require('mssql');

class User {
  static async findByEmail(email) {
    const users = await query(`
      SELECT * FROM Users 
      WHERE Email = @param0
    `, [email]);
    return users[0];
  }

  static async create(userData) {
    const result = await query(`
      INSERT INTO Users (Email, Password, Name, Phone, Role)
      OUTPUT INSERTED.*
      VALUES (@param0, @param1, @param2, @param3, @param4)
    `, [
      userData.email,
      userData.password,
      userData.name,
      userData.phone,
      userData.role || 'user'
    ]);
    return result[0];
  }

  static async findById(id) {
    const users = await query(`
      SELECT Id, Email, Name, Phone, Role, CreatedAt, UpdatedAt
      FROM Users 
      WHERE Id = @param0
    `, [id]);
    return users[0];
  }

  static async update(id, userData) {
    const result = await query(`
      UPDATE Users
      SET 
        Name = @param1,
        Phone = @param2,
        UpdatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE Id = @param0
    `, [id, userData.name, userData.phone]);
    return result[0];
  }
}

module.exports = User;
