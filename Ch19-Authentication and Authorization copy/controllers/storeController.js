const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  console.log("session value: ",req.session);
  Home.find()
    .then(registeredHomes => {
      res.render("store/index", {
        registeredHomes,
        pageTitle: "Airbnb Home",
        currentPage: "index",
        isLoggedIn: req.isLoggedIn,
        user : req.session.user

      });
    })
    .catch(err => {
      console.error("Error fetching homes:", err);
      next(err);
    });
};


exports.getHomes = (req, res, next) => {
  Home.find().then(registeredHomes => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user : req.session.user

    })
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user : req.session.user

  })
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.find()
    .populate('houseId')
    .then(favourites => {
      const favouriteHomes = favourites.map((fav) => fav.houseId);
      res.render("store/favourite-list", {
        favouriteHomes: favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
        isLoggedIn: req.isLoggedIn,
        user : req.session.user

      })
    })

};

exports.postAddToFavourite = (req, res, next) => {

  const homeId = req.body.id;
  Favourite.findOne({ houseId: homeId }).then((fav) => {
    if (fav) {
      console.log("Already marked as favourite");
    } else {
      fav = new Favourite({ houseId: homeId });
      fav.save().then(result => {
        console.log('Favourite added: ', result);
      })
    }
    res.redirect("/favourites");
  }).catch(err => {
    console.log("Error while marking the favourite: ", err);
  });
}

exports.postRemoveFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({ houseId: homeId }).then(result => {
    console.log('Favourite deleted: ', result);
  }).catch(err => {
    console.log("Error while removing favourite: ", err);
  }).finally(() => {
    res.redirect("/favourites");
  });
}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((homes) => {
    const home = homes[0];
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user : req.session.user

      });
    }
  })
};

