const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
      },
    role: { type: String, enum: ["admin", "staff"], default: "staff" },
    googleId: { type: String }, // For Google OAuth
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model("User", UserSchema);

module.exports =User;
