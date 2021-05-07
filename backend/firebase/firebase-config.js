var admin = require("firebase-admin");

var serviceAccount = require("./ilost-2617b-firebase-adminsdk-r96vp-bbc567099d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin
