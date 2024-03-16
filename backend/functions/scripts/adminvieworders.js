const express = require('express');
const admin = require('firebase-admin');
const app = express();

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ordering-system-7c42a-default-rtdb.firebaseio.com/"
});

app.use(express.json());