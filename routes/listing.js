const express=require("express");
const router= express.Router({mergeParams:true});
const wrapasync=require("../utils/asyncwrap.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController= require("../controllers/listing.js");
const multer  = require('multer');
const {storage}= require("../Cloudconfig.js");
const upload = multer({storage});




const validateListing=(req,res,next)=>{
 let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{next()}
};

router
.route("/")
.get(wrapasync(listingController.index))
.post( isLoggedIn,
   upload.single("listing[image]"), validateListing,wrapasync(listingController.createListing));


//NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get(wrapasync(listingController.showListing))
.put( isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,wrapasync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapasync(listingController.destroyListing));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn , isOwner, wrapasync(listingController.editListing));

module.exports = router;