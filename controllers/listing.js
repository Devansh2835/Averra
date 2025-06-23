const Listing = require("../models/listing");

module.exports.index= async (req, res) => {
    const { category } = req.query;
    if (category) {
        const listings = await Listing.find({ category: new RegExp(`^${category}$`, 'i') });
        if (listings.length === 0) {
            req.flash("error", "No listings found for this category!");
            return res.redirect("/listings");
        }
        else {
            return res.render("listing/index.ejs", { allListings: listings });
        }
    }
    const allListings = await Listing.find({});
    res.render("listing/index.ejs",{allListings})
}
module.exports.renderNewForm=(req,res)=>{
    res.render("listing/new.ejs")
}
module.exports.showListing= async (req,res)=>{ 
    let {id}= req.params
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path: "author"},}).populate("owner") // populate the reviews and owner fields
    if(!listing){
        req.flash("error","Listing you requested does not exist!")
        return res.redirect("/listings")
    }
    console.log(listing)
    res.render("listing/show.ejs",{listing})
}
module.exports.createListing= async (req,res)=>{
    const newListing= new Listing(req.body.listing)
    //image upload handling and ip address storage
    let url=req.file.path
    let filename=req.file.filename
    newListing.owner= req.user._id // set the owner of the listing to the current user
    newListing.image={url,filename} // set the image url and filename to the file path
    newListing.ipAddress = req.ip; // store the IP address of the user who created the listing
    console.log(newListing.ipAddress)
    console.log(newListing.category)
    await newListing.save()
    req.flash("success","New listing created successfully!")
    res.redirect(`/listings/${newListing._id}`);
}
module.exports.renderEditForm= async (req,res)=>{
    let {id}= req.params
    const listing= await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing you requested does not exist!")
        return res.redirect("/listings")
    }
    // let originalImageUrl = listing.image.url; 
    // originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_200,q_30"); // Adjust the URL to scale the image width to 500px
    res.render("listing/edit.ejs",{listing})
} 
module.exports.updateListing= async (req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !== "undefined"){ // check if the file is uploaded
        let url=req.file.path
        let filename=req.file.filename
        listing.image={url,filename} 
        await listing.save()
    }
    req.flash("success","Listing updated successfully!")
    res.redirect(`/listings/${id}`)
}
module.exports.destroyListing= async (req,res)=>{
    let {id}= req.params
    let deletedListing= await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success","Listing deleted successfully!")
    res.redirect("/listings")
}
