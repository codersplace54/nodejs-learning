const { response } = require("express");
const Home = require("../models/home");
const fs = require("fs");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user : req.session.user
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then((homes) => {
    const home = homes;
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user : req.session.user
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user : req.session.user
    })
  });
};

exports.postAddHome = (req, res, next) => {
  if(!req.file){
    return res.status(400).send('No image provided');
  }

  console.log(req.file);
  const { houseName, price, location, rating, description } = req.body;
  const photo = req.file.path;
  const home = new Home({ houseName, price, location, rating, photo, description });
  home.save().then(() => {
    console.log('Home saved successfully');
  });

  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, photo, description } = req.body;
  Home.findById(id).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    if(req.file){
      fs.unlink(home.photo, (err) => {
        if(err){
          console.log("Error during deletion of image: ".err);
        }
      })
      home.photo = req.file.path;
    }
    home.description = description;
    home.save().then(result => {
      console.log('Home updated successfully', result);
    }).catch(err => {
      console.log('Error during updating home: ', err);
    });
  }).catch(err => {
    console.log('Error while finding home: ', err);
  });

  res.redirect("/host/host-home-list");
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log('Came to delete ', homeId);
  Home.findByIdAndDelete(homeId).then(() => {
    res.redirect("/host/host-home-list");
  }).catch(error => {
    console.log('Error while deleting ', error);
  })
};