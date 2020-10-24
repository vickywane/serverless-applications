require("dotenv").config();
var api_key = process.env.MAILGUN_API;
var domain = process.env.MAILGUN_SANDBOX;
const nodemailer = require("nodemailer");

const username = process.env.SMTP_USERNAME;
const password = process.env.SMTP_PASSWORD;

exports.Emailer = function (req, res) {
  // let sender = process.env.SENDER;
  // let reciever = req.body.email;
  // let type = req.body.type;
  // let token = req.body.token;
  // let user = req.body.name;
  // var transport = nodemailer.createTransport({
  //   host: process.env.HOST,
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: username,
  //     pass: password,
  //   },
  // });
  // transport.verify(function (error, success) {
  //   if (error) {
  //     res
  //       .status(401)
  //       .send({ error: `failed to connect with stmp. check credentials` });
  //   } else {
  //     res.status(200).send();
  //   }
  // });
  // if (reciever == null) {
  //   // console.log(req.body)
  //   res.status(401).send({ error: `Empty email address` });
  // } else {
  //   return transport.sendMail(
  //     {
  //       from: sender,
  //       to: reciever,
  //       subject: "Welcome to GetBeta",
  //       html: { path: "dist/welcome.html" },
  //     },
  //     (error, info) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log("message sent");
  //       }
  //       transport.close();
  //     }
  //   );
  // }
};
