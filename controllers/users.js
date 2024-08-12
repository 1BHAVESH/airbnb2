const User = require("../models/user");

module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup.ejs");
}

module.exports.signup =  async(req, res) =>{

    try{
        let{username, email, password} = req.body;
        let newUser = new User({username, email});
        let registerdUser = await User.register(newUser, password);

        console.log(registerdUser);
        req.login(registerdUser, (err) =>{
            if(err){
                return err;
            }
            req.flash("success", "welcome to wanderlust!");
            res.redirect("/listings");
        });
       
    }catch(error){
        req.flash("error", error.message);
        res.redirect("/signup");
    }

}

// login

module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
}

module.exports.login =  async(req, res) =>{
    req.flash("success", "Welcome to wondurlust you are logged in!");

    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect (redirectUrl);
}

module.exports.logout = (req, res, next) =>{
    req.logOut((err) =>{
        if(err){
           return next();
        }

        req.flash("success", "you logged out successfully");
        res.redirect("/listings");
        
    })
}