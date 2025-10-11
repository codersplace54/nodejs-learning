// Core Modules
const { Collection, ObjectId } = require("mongodb");
const { getDB } = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl, description, id) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description = description;
    this._id = _id;
  }

  save() {
    if(this._id){ //edit
      return db.Collection('homes').updateOne({_id:new ObjectId(String(homeId))},
      {$set: this}
    );
    }else { // save
      const db = getDB();
      return db.collection('homes').insertOne(this);
    }
  }


  static fetchAll() {
    const db = getDB();
    return db.collection("homes").find().toArray();
  }

  static findById(homeId) {
    const db = getDB();
    return db.collection('homes').find({_id:new ObjectId(String(homeId))}).next()
  }

  static deleteById(homeId) {
    const db = getDB();
    return db.collection('homes')
    .deleteOne({_id: new ObjectId(String(homeId))}).next();
  }
};
