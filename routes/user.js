const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirctUrl} = require("../middleweres.js");

const userController = require("../controllers/users.js")


//sign up

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//login route

router.route("/login")
.get( userController.renderLoginForm)
.post(saveRedirctUrl,
   passport.authenticate("local", {
   failureRedirect: "/login",
    failureFlash: true
  }), userController.login
 );

router.get("/logout", userController.logout)

module.exports = router;

// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email: "bhavesh@gamil.com",
//         username: "Bhavesh-joshi"
//     });

//     let registerdUser = await User.register(fakeUser, "joshisahab");
//     res.send(registerdUser);
// })