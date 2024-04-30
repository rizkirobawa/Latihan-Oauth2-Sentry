var express = require("express");
var router = express.Router();
const User = require("../v1/user.routes");
const Auth = require("../v1/auth.routes")
const { imageStorage, image } = require("../../libs/multer");

router.post("/upload/image", imageStorage.single("image"), (req, res) => {
  let imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  res.render("uploadedImage", { image_url: imageUrl });

  //   jika mau tampilan json

  //     res.json({
  //     image_url: imageUrl
  //   })
});

// upload multiple images
router.post("/upload/images", imageStorage.array("image"), (req, res) => {
  let imagesUrl = req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/images/${file.filename}`;
  });
  res.json({ images_url: imagesUrl });
});

const {
  imageKitUpload,
  generateQR,
} = require("../../controllers/media.controllers");
router.post("/imagekit/upload/image", image.single("file"), imageKitUpload);
router.post("/qr/generate", generateQR);

// User Endpoint
router.use("/api/v1", User);
router.use("/api/v1", Auth);

module.exports = router;
