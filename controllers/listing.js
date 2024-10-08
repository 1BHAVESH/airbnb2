const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { query } = require("express");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req, res) =>{
    let finds = await Listing.find({category: "main"});

    // console.log(finds);
    
      
    res.render("./listings/index.ejs", {finds});

    //  if(allListings.category == "trand"){
        
    //  }
    
    // res.render("./listings/index.ejs", {allListings}); 
 };

 module.exports.renderNewForm = (req, res) =>{

    res.render("./listings/new.ejs");
 };

 module.exports.showListings = async(req, res) =>{

    let {id} = req.params;
    console.log(id);
    let listing = await Listing.findById(id).populate
    ({path: "reviews",
     populate: {
        path: "author",
     },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "This listing does not exist!");
        res.redirect("/listings"); 
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
}

module.exports.createNewListings = async(req, res, next) =>{

    

    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    
   

   let url = req.file.path;
   let filename = req.file.filename;
   let listing = req.body.listing;
   console.log("--------->",listing.category);
   const newListing = new Listing(listing);
//    newListing.category = req.body.listing.category;
   newListing.owner = req.user._id;
   newListing.image = {url, filename};

   newListing.geometry =  response.body.features[0].geometry;

   let savedListing =  await newListing.save(); 
   console.log(savedListing);

   req.flash("success", "New listing is created!");
   res.redirect("/listings"); 
}

module.exports.editRanderForm = async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This listing does not exist!");
        res.redirect("/listings"); 
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250" );
    res.render("./listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListings = async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    //if(req.file)
    
    if(typeof req.file !== "undefined"){

        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();

    }
   

   req.flash("success", "Listing is updated!");
   res.redirect(`/listings/${id}`);
}

module.exports.destroy = async(req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing); 
    req.flash("success", "Listing is deleted!");
    res.redirect("/listings");
    
}

module.exports.roomsShow = async(req, res) =>{
    let finds = await Listing.find({category: "rooms"});

    // console.log(finds);
    
      
    res.render("./listings/room.ejs", {finds});
 };

 module.exports.cities = async(req, res) =>{
    let finds = await Listing.find({category: "top cities"});

    // console.log(finds);
    
      
    res.render("./listings/city.ejs", {finds});
 };

 module.exports.mountain = async(req, res) =>{
    let finds = await Listing.find({category: "mountains"});

    // console.log(finds);
    
      
    res.render("./listings/mountain.ejs", {finds});
 };

 module.exports.Castles = async(req, res) =>{
    let finds = await Listing.find({category: "Castles"});

    console.log(finds);

    // console.log(finds);
    
      
    res.render("./listings/Castles.ejs", {finds});
 };

 module.exports.trand = async(req, res) =>{
    let finds = await Listing.find({category: "trand"}); 
   
 res.render("./listings/trend.ejs", {finds});
 };

 

 module.exports.Pools = async(req, res) =>{
    let finds = await Listing.find({category: "Pools"}); 
   
 res.render("./listings/Pools.ejs", {finds});
 };

 

 module.exports.camps = async(req, res) =>{
    let finds = await Listing.find({category: "camps"}); 

    console.log(finds);
   
 res.render("./listings/camps.ejs", {finds});
 };

 module.exports.search = async(req, res) =>{
    let finds = await Listing.find({category: "camps"}); 

    console.log(finds);
   
 res.render("./listings/camps.ejs", {finds});
 };


//  module.exports.search = async(req, res) =>{
    

//     let {country} = req.query.listing.country;
//     console.log(`Country: ${country}`);
   
 
//  };
 