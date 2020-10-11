require("dotenv").config();
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

exports.firestoreFunction = function (req, res) {
    const { name, email, type } = req;

    switch (type) {
        case "READ":
            break;
        default:
            break;
    }

    const firestore = new Firestore({
        keyFilename: path.join(__dirname, "./service-key.json"),
    });

    const document = firestore.collection("users");

    //console.log(document, "document");

    document.add({
        title: "John Nwani",
        email: "john@gmail.com",
    });
};
