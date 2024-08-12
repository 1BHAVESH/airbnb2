const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{validateReview, isLoggedIn, isReviewAuthor} = require("../middleweres.js");

const reviewController = require("../controllers/review.js");


// Reviws
//post reviews routes



router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.reviewPost));

// Delete reviw route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.reviewDelete));

module.exports = router;
