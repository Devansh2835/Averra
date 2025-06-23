const User= require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup = async (req,res)=>{
    try {
        let {username, email, password}= req.body;
        const newUser= new User({username, email});
        const registeredUser= await User.register(newUser, password)
        console.log(registeredUser);
        
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    } 
    catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async(req,res)=>{
   req.flash("success","Welcome to Wanderlust! You are logged in successfully.");
   let redirectUrl= res.locals.redirectUrl || "/listings"; // if redirectUrl is not set, default to /listings for eg when we directly log in from the home page we wont be having any redirectUrl set in the session which will cause an error
   res.redirect(redirectUrl);
}
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You have logged out successfully!");
        res.redirect("/listings");
    })
}
