require("dotenv").config();
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const cors = require("cors")({ origin: true });
const bcrypt = require("bcryptjs");
const scheduler = require("@google-cloud/scheduler");
const { Storage } = require("@google-cloud/storage");
const { v4: uuid } = require("uuid");

const StorageClient = new Storage();

var api_key = process.env.MAILGUN_API;
var domain = process.env.MAILGUN_SANDBOX;
const nodemailer = require("nodemailer");

const username = process.env.SMTP_USERNAME;
const password = process.env.SMTP_PASSWORD;

exports.firestoreAuthenticationFunction = function (req, res) {
    return cors(req, res, () => {
        const { email, password, type } = req.body;

        const firestore = new Firestore({
            keyFilename: path.join(__dirname, "./service-account.json"),
        });

        const document = firestore.collection("users");
        const ScheduleClient = new scheduler.CloudSchedulerClient({
            keyFilename: path.join(__dirname, "./service-account.json"),
        });

        const parent = ScheduleClient.locationPath(
            process.env.PROJECT_ID,
            process.env.LOCATION_ID
        );

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
                            email: email,
                        },
                    },
                    schedule: "*/30 */6 */5 10 4",
                    timezone: "Africa/Lagos",
                };

                const request = {
                    parent: parent,
                    job: job,
                };
                const id = uuid();

                return bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        document
                            .doc(id)
                            .set({
                                id: id,
                                email: email,
                                password: hash,
                                img_uri: null,
                            })
                            .then((response) => {
                                ScheduleClient.createJob(request)
                                    .then(() => {
                                        res.status(200).send(response);
                                    })
                                    .catch((e) => {
                                        res.status(501).send(
                                            `error creating cron job : ${e}`
                                        );
                                    });
                            })
                            .catch((e) => {
                                res.status(501).send(
                                    `error inserting data : ${e}`
                                );
                            });
                    });
                });

            case "LOGIN-USER":
                // fetch user data first using email and compare password

                return document
                    .where("email", "==", email)
                    .get()
                    .then((query) => {
                        query.forEach((doc) => {
                            bcrypt.compare(
                                password,
                                doc.data().password,
                                (err, data) => {
                                    if (err) {
                                        res.status(404).send(
                                            "user credentials invalid"
                                        );
                                    } else if (data) {
                                        res.status(200).send(doc.data());
                                    }
                                }
                            );
                        });
                    })
                    .catch((e) => console.log("error", e));

            default:
                res.status(422).send(`${type} is not a valid function action`);
        }
    });
};

exports.Uploader = (req, res) => {
    return cors(req, res, () => {
        const { file, userId } = req.body;
        // const firestore = new Firestore({
        //   keyFilename: path.join(__dirname, "./service-account.json"),
        // });

        const firestore = new Firestore();

        const document = firestore.collection("users");
        const Bucket = process.env.BUCKET_NAME;

        StorageClient.bucket(Bucket)
            .file(file.path)
            .on("finish", () => {
                console.log("UPLOADED");
                StorageClient.bucket(Bucket)
                    .file(file.path)
                    .makePublic()
                    .then(() => {
                        const img_uri = `https://storage.googleapis.com/${Bucket}/${file.path}`;
                        document
                            .doc(userId)
                            .update({
                                img_uri,
                            })
                            .then((updateResult) =>
                                res.status(200).send(updateResult)
                            )
                            .catch((e) => res.status(500).send(e));
                    })
                    .catch((e) => console.log(e));
            });
    });
};

exports.Emailer = function (req, res) {
    let sender = process.env.SENDER;
    let reciever = req.body.email;
    let type = req.body.type;
    let token = req.body.token;
    let user = req.body.name;
    var transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: 587,
        secure: false,
        auth: {
            user: username,
            pass: password,
        },
    });
    transport.verify(function (error, success) {
        if (error) {
            res.status(401).send({
                error: `failed to connect with stmp. check credentials`,
            });
        } else {
            res.status(200).send();
        }
    });
    if (reciever == null) {
        // console.log(req.body)
        res.status(401).send({ error: `Empty email address` });
    } else {
        return transport.sendMail(
            {
                from: sender,
                to: reciever,
                subject: "Welcome to GetBeta",
                html: { path: "dist/welcome.html" },
            },
            (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("message sent");
                }
                transport.close();
            }
        );
    }
};

exports.demo = (req, res) => {
    return res.status(200).send({ data: `Hello ${req.query.name}` });
};
