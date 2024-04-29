// models/AdminModel.js

const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const {
  hashPassword,
  comparePasswords,
} = require("../services/encryptions/BcryptHandler");
const { AdminLoginDTO, AdminRegisterDTO } = require("../dtos/AdminDTO");
const { generateToken } = require("../../config/authentications/jwt.config");
const { validateOTP } = require("../services/otpHandlers/HandleOTP");

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

    const token = generateToken(admin?.email);
    const adminDTO = new AdminLoginDTO(admin, token);

    return { admin: adminDTO };
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
    const token = generateToken(newAdmin?.email);
    const adminDTO = new AdminRegisterDTO(newAdmin, token);

    return { admin: adminDTO };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};

// Static method for updating admin data
adminSchema.statics.updateAdminById = async function ({ id, updateData }) {
  try {
    const updatedAdmin = await this.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedAdmin) {
      return { error: "Failed to update admin" };
    }

    return { admin: updatedAdmin };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};

// Static method for sending OTP
adminSchema.statics.updatePasswordByOTP = async function ({
  email,
  otp,
  newPassword,
}) {
  try {
    // Validate OTP
    const otpStatus = await validateOTP({ email, otp, Model: this });
    if (otpStatus.error) {
      return { error: otpStatus.error };
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password
    const updatedAdmin = await this.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedAdmin) {
      return { error: "No modifications were made" };
    }

    return updatedAdmin;
  } catch (error) {
    throw error;
  }
};

// Static method for updating password by email
adminSchema.statics.updatePasswordByEmail = async function ({
  email,
  oldPassword,
  newPassword,
}) {
  try {
    const admin = await this.findOne({ email });

    if (!admin) {
      return { error: "Admin not found" };
    }

    const passwordMatch = await comparePasswords(oldPassword, admin.password);

    if (!passwordMatch) {
      return { error: "Invalid password" };
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedAdmin = await this.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return updatedAdmin;
  } catch (error) {
    throw error;
  }
};

adminSchema.statics.deleteAdminById = async function (id) {
  try {
    const result = await this.deleteOne({ _id: id });

    if (result?.deletedCount === 0) {
      return { error: `No admin found to delete with this id: ${id}` };
    } else {
      return { message: `Admin deleted successfully with id: ${id}` };
    }
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
