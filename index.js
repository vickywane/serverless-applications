require("dotenv").config();
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const cors = require("cors")({ origin: true });
const bcrypt = require("bcryptjs");
const scheduler = require("@google-cloud/scheduler");

// const [file] = client
//     .accessSecretVersion({
//         email: "firestore-config",
//     })
//     .then((res) => {
//         console.log(res, "sec value");
//     })
//     .catch((e) => console.log("error"));

exports.firestoreAuthenticationFunction = function (req, res) {
  return cors(req, res, () => {
    const { email, password, type } = req.body;

    const firestore = new Firestore({
      keyFilename: path.join(__dirname, "./service-key.json"),
    });
    const document = firestore.collection("users");
    const ScheduleClient = new scheduler.CloudSchedulerClient();
    console.log(ScheduleClient);


    if (!type) {
      res.status(422).send("An action type was not specified");
    }

    switch (type) {
      case "CREATE-USER":
        if (!email || !password) {
          res.status(422).send("email and password fields missing");
        }

        const job = {
          httpTarget: {
            uri: process.env.EMAIL_FUNCTION_ENDPOINT,
            httpMethod: "POST",
            body: {
              email : ""
            },
          },
          schedule: "",
          timezone: "Africa/Lagos",
        };

        const request = {
          parent: parent,
          job: job,
        };

        return bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            document
              .add({
                email: email,
                password: hash,
              })
              .then((response) => {
                ScheduleClient.createJob(request).then(() =>
                  res.status(200).send(response)
                );
              })
              .catch((e) =>
                res.status(501).send(`error inserting data : ${e}`)
              );
          });
        });

      case "LOGIN-USER":
        // fetch user data first using email and compare password

        return document
          .where("email", "==", email)
          .get()
          .then((query) => {
            query.forEach((doc) => {
              bcrypt.compare(password, doc.data().password, (err, data) => {
                if (err) {
                  res.status(404).send("user credentials invalid");
                } else if (data) {
                  res.status(200).send(doc.data());
                }
              });
            });
          })
          .catch((e) => console.log("error", e));

      default:
        res.status(422).send(`${type} is not a valid function action`);
    }
  });
};
