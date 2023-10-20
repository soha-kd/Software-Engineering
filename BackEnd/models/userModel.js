const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "لطفا نام خود را وارد کنید"],
    },
    email: {
      type: String,
      required: [true, "لطفا ایمیل خود را وارد کنید"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "لطفا ایمیل معتبر وارد کنید",
      ],
    },
    password: {
      type: String,
      required: [true, "لطفا رمز عبور خود را مشخص کنید"],
      minLength: [6, "رمز عبور حداقل 6 حرف باشد"],
      //   maxLength: [23, "Password must not be more than 23 characters"],
    },
    photo: {
      type: String,
      required: [true, "لطفا یک عکس انتخاب کنید"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
      type: String,
      default: "+98",
    },
    bio: {
      type: String,
      maxLength: [250, "بیوگرافی بیش از 250 کاراکتر نباشد"],
      default: "بیوگرافی",
    },
  },
  {
    timestamps: true,
  }
);

//   Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  });

const User = mongoose.model("User", userSchema);
module.exports = User;