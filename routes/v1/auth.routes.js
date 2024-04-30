const router = require("express").Router();
const {
  login,
  verified,
} = require("../../controllers/auth.controllers");
const  {restrict}  = require("../../middlewares/auth.middlewares");

router.post("/auth/login", login);
router.get("/auth/authenticate", restrict, verified);

module.exports = router;