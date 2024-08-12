if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const dbUrl = process.env.ATLASDB_URL

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js"); 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js"); 
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash =  require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(() =>{
    console.log("conected to DB");
}).catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {

        secret: process.env.SECRET,
    },

    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("ERROR IN MONGO SESSION STORE");
})

const sessionsOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true

    }
}



app.use(session(sessionsOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
   
    next();
})

// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email: "bhavesh@gamil.com",
//         username: "Bhavesh-joshi"
//     });

//     let registerdUser = await User.register(fakeUser, "joshisahab");
//     res.send(registerdUser);
// })

// app.get("/listings/rooms",  async(req, res) =>{
//     let finds = await Listing.find({category: "rooms"});

//     console.log(finds);
    
      
//     res.render("./listings/room.ejs", {finds});
// })

app.get("/listings/trend",  async(req, res) =>{
    let finds = await Listing.find({category: "trand"});

    console.log(finds);
    
      
    res.render("./listings/trend.ejs", {finds});
})

// listings routes

app.use("/listings", listingsRouter);

// review routes



app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", userRouter);



// app.get("/", (req, res) =>{
//     res.send("hi, i am the root");
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404 ,"Page not found"))
  });
  
  app.use((err, req , res , next)=>{
  let {statusCode = 500 ,message = "something went wrong"} =  err;
  res.render("error.ejs",{message});
  // res.status(statusCode).send(message);
  });

// app.all("*",(req, res,next)=>{
//     next(new ExpressError(404,"page not found"));
// })

// app.use((err, req, res, next) =>{
//     let{status=500, message="something went wrong!"} = err;
//     res.render("error.ejs",{message});
// })

app.use((err, req, res, next) =>{
    res.send("something went worng");
})

app.listen(port, () =>{
    console.log("server is listnig to post", port);
})