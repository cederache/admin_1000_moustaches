const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://1000-moustaches.firebaseio.com",
});

module.exports = admin;
