// models/AdminModel.js

const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { InitiateToken } = require("../services/tokens/InitiateToken");
const {
  hashPassword,
  comparePasswords,
} = require("../services/encryptions/bcryptHandler");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fileUrl: String,
  websiteLink: String,
  createdAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
});

// static method for login
adminSchema.statics.login = async function ({ email, password }) {
  try {
    const admin = await this.findOne({ email }).exec();

    if (!admin) {
      return { error: "Admin not found" };
    }

    const passwordMatch = await comparePasswords(password, admin?.password);
    if (!passwordMatch) {
      return { error: "Invalid password" };
    }
    const token = InitiateToken(admin?._id);
    return { admin, token };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};

// static method for registration
adminSchema.statics.register = async function ({ name, email, password }) {
  try {
    //check if the admin already exists
    const existingAdminCheck = await this.findOne({ email }).exec();
    if (existingAdminCheck) {
      return { error: "Admin already exists" };
    }

    //hash the password
    const hashedPassword = await hashPassword(password);
    console.log("hashedPassword", hashedPassword);

    //create a new admin instance
    const newAdmin = new this({ name, email, password: hashedPassword });

    //save the admin to the database
    await newAdmin.save();

    //generate token
    const token = InitiateToken(newAdmin._id);

    return { message: "Admin created successfully", token, admin: newAdmin };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
