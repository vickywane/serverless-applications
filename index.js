require("dotenv").config();
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

exports.firestoreFunction = function (req, res) {
    res.set("Access-Control-Allow-Origin", "*");
    const { name, email, type } = req.body;
    const firestore = new Firestore({
        keyFilename: path.join(__dirname, "./service-key.json"),
    });

    const document = firestore.collection("users");
    console.log(type);

    if (!type) {
        res.status(422).send("An action type was not specified");
    }

    switch (type) {
        case "CREATE":
            document.add({
                username: name,
                email: email,
            });

        case "READ":
            break;

        case "GET":
            break;
        case "UPDATE":
            break;
        default:
            break;
    }
};
