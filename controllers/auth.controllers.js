const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
// const Sentry = require("../libs/sentry");

module.exports = {
  login: async (req, res, next) => {
    try {
      //   if (1 == 1) {
      //     Sentry.captureException("bla bla bla");
      //   }

      let { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "Email and password are required!",
          data: null,
        });
      }

      let user = await prisma.user.findFirst({
        where: { email },
      });
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Invalid email or password!",
          data: null,
        });
      }

      await bcrypt.compare(password, user.password);

      // delete user.password;
      // let token = jwt.sign(user, JWT_SECRET_KEY);
    let token = jwt.sign({id: req.user.id}, JWT_SECRET_KEY);


      res.json({
        status: true,
        message: "OK",
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  },

  verified: async (req, res, next) => {
    try {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  },

  googleOauth2: (req, res) => {
    // let token = jwt.sign({ ...req.user }, JWT_SECRET_KEY);
    let token = jwt.sign({id: req.user.id, password: null}, JWT_SECRET_KEY);

    res.json({
      status: true,
      message: "OK",
      err: null,
      data: { user:req.user, token },
    });
  },
};
