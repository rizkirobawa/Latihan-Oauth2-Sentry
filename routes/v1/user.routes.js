const router = require("express").Router();
const {
  store,
  index,
  show,
  update,
  avatar,
  destroy
} = require("../../controllers/user.controllers");
const { restrict } = require("../../middlewares/auth.middlewares");
const { image } = require("../../libs/multer");

router.post("/users", store);
router.get("/users", restrict, index);
router.get("/users/:id", restrict, show);
router.put("/users/:id/profile", restrict, update);
router.put("/users/:id/avatar", restrict, image.single("file"), avatar);
router.delete("/users/:id", restrict, destroy);

module.exports = router;
