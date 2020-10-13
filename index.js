require("dotenv").config();
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();
//console.log(client);

exports.firestoreFunction = function (req, res) {
// let req = { name: "", email: "", type: "" };
// let res = { name: "", email: "", type: "" };
//res.set("Access-Control-Allow-Origin", "*");
//const { name, email, type } = req.body;
// const firestore = new Firestore();
// const type = "";
// const document = firestore.collection("users");
// console.log(document);

// client.accessSecretVersion

  client
    .accessSecretVersion({
        name: "firestore-config",
    })
    .then((res) => {
        console.log(res, "sec value");
    })
    .catch((e) => console.log("error" , e));

// if (!type) {
//     //res.status(422).send("An action type was not specified");
// }

// switch (type) {
//     case "CREATE":
//         document.add({
//             //          username: name,
//             //        email: email,
//         });

//     case "READ":
//         break;

//     case "GET":
//         break;
//     case "UPDATE":
//         break;
//     default:
//         break;
// }
};
