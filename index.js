require("dotenv").config();
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const cors = require("cors")({ origin: true });

const client = new SecretManagerServiceClient();
//console.log(client);

exports.firestoreFunction = function (req, res) {
    //   let req = { email: "", email: "", type: "" };
    //   let res = { email: "", email: "", type: "" };
    //res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //   "Access-Control-Allow-Origin",
    //  "Origin, X-Requested-With, Content-Type, Accept"
    // );
    //
    console.log("invoke");
    return cors(req, res, () => {
        const { email, password, type } = req.body;

        console.log(email , password, req.body)
        //console.log(req.body, "data");
        
        const firestore = new Firestore({
            keyFilename: path.join(__dirname, "./service-key.json"),
        });
        //  const type = "";
        const document = firestore.collection("users");

        // const [file] = client
        //     .accessSecretVersion({
        //         email: "firestore-config",
        //     })
        //     .then((res) => {
        //         console.log(res, "sec value");
        //     })
        //     .catch((e) => console.log("error"));

        if (!type) {
            res.status(422).send("An action type was not specified");
        }

        switch (type) {
            case "CREATE":
                document
                    .add({
                        email: email,
                        password: password,
                    })
                    .then((response) => res.status(200).send(response))
                    .catch((e) =>
                        res.status(501).send(`error inserting data : ${e}`)
                    );

            case "READ":
                break;

            case "GET":
                break;
            case "UPDATE":
                break;
            default:
                res.status(422).send(`${type} is not a valid function action`)
        }
    });
};
