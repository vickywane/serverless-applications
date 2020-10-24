require("dotenv").config();
const Cors = require("cors");
const Storage = require("@google-cloud/storage");
const path = require("path");

const StorageClient = new Storage({
  keyFilename: path.join(__dirname, "./service-key.json"),
});
const BucketName = "";

exports.uploader = (req, res) => {
  return Cors(req, res, () => {
    const { file } = req.body;

    StorageClient.bucket(BucketName)
      .file(file.name)
      .on("finish", () => {
        StorageClient.bucket(BucketName)
          .file(file.name)
          .makePublic()
          .then((response) => {
            console.log(response);
          })
          .catch((e) => console.log(e));
      });
  });
};
