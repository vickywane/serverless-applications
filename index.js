require("dotenv").config();
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const cors = require("cors")({ origin: true });

const client = new SecretManagerServiceClient();

const hashPassword = password => {
   const newPassword = ""

    return newPassword
}

exports.firestoreFunction = function (req, res) {
   return cors(req, res, () => {
        const { email, password, type } = req.body;

      const firestore = new Firestore({
            keyFilename: path.join(__dirname, "./service-key.json"),
        });
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
                        password: hashPassword(password)
                    })
                    .then((response) => res.status(200).send(response))
                    .catch((e) =>
                        res.status(501).send(`error inserting data : ${e}`)
                    );

            case "READ":
                document.get().then(response => {

                }).catch(e => res.status(501).send(`error occurred from pulling data ${e}`))

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
