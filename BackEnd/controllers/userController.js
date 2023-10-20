const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");



    // Generate Token
    const generateToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    };

    // Register User
    const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    // Validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("لطفا تمام موارد خواسته شده را پر کنید");
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error("رمز عبور حداقل 6 حرف باشد");
    }
  
    // Check if user email already exists
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400);
      throw new Error("اکانتی با این ایمیل ثبت شده است");
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    })

    //   Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
    });

    if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(201).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token,
      });
    } else {
      res.status(400);
      throw new Error("اطلاعات کاربر اشتباه است");
    }
  });


    // Login User
    const loginUser = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
    
        // Validate Request
        if (!email || !password) {
        res.status(400);
        throw new Error("لطفا ایمیل و رمز عبور را وارد کنید");
        }
    
        // Check if user exists
        const user = await User.findOne({ email });
    
        if (!user) {
        res.status(400);
        throw new Error("کاربری یافت نشد ، لطفا ثبت نام کنید");
        }
    
        // User exists, check if password is correct
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
    
        //   Generate Token
        const token = generateToken(user._id);
        
        if(passwordIsCorrect){
        // Send HTTP-only cookie
        res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
        });
    }
        if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token,
        });
        } else {
        res.status(400);
        throw new Error("ایمیل یا رمز عبور نامعتبر است");
        }
    });
  
// Logout User
const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({ message: "خروج با موفقیت انجام شد" });
  });


// Get User Data
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
      });
    } else {
      res.status(400);
      throw new Error("کاربر یافت نشد");
    }
  });

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }
    return res.json(false);
  });


// Update User
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      const { name, email, photo, phone, bio } = user;
      user.email = email;
      user.name = req.body.name || name;
      user.phone = req.body.phone || phone;
      user.bio = req.body.bio || bio;
      user.photo = req.body.photo || photo;
  
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photo: updatedUser.photo,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
      });
    } else {
      res.status(404);
      throw new Error("کاربر یافت نشد");
    }
  });


  // Change password
  const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { oldPassword, password } = req.body;
  
    if (!user) {
      res.status(400);
      throw new Error("کاربر یافت نشد ، لطفا ثبت نام کنید");
    }
    //Validate
    if (!oldPassword || !password) {
      res.status(400);
      throw new Error("لطفا رمز عبور جدید و قبلی را وارد کنید");
    }
  
    // check if old password matches password in DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  
    // Save new password
    if (user && passwordIsCorrect) {
      user.password = password;
      await user.save();
      res.status(200).send("رمز عبور با موفقیت تغییر یافت");
    } else {
      res.status(400);
      throw new Error("رمزعبور قبلی نادرست است");
    }
  });

  //Forgot password
  const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      res.status(404);
      throw new Error("کاربری یافت نشد");
    }
  
    // Delete token if it exists in DB
    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }
  
    // Create Reste Token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    console.log(resetToken);
  
    // Hash token before saving to DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Save Token to DB
    await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
    }).save();
  
    // Construct Reset Url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  
    // Reset Email
    const message = `
        <h2>سلام ${user.name}</h2>
        <p>لطفا از لینک زیر برای بازیابی رمز عبور خود استفاده کنید</p>  
        <p>این لینک فقط به مدت 30 دقیقه معتبر خواهد بود.</p>
  
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>تیم پروژه</p>
      `;
    const subject = "درخواست بازیابی رمز عبور";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
  
    try {
      await sendEmail(subject, message, send_to, sent_from);
      res.status(200).json({ success: true, message: "ایمیل بازیابی ارسال شد" });
    } catch (error) {
      res.status(500);
      throw new Error("ایمیل بازیابی ارسال نشد،مجددا تلاش کنید");
    }
  });

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;
  
    // Hash token, then compare to Token in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // fIND tOKEN in DB
    const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });
  
    if (!userToken) {
      res.status(404);
      throw new Error("توکن مورد نظر معتبر نیست");
    }
  
    // Find user
    const user = await User.findOne({ _id: userToken.userId });
    user.password = password;
    await user.save();
    res.status(200).json({
      message: "بازیابی رمز عبور با موفقیت انجام شد، لطفا وارد شوید",
    });
  });

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword
  };