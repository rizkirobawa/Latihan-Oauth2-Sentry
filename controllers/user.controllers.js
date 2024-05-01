const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const imagekit = require("../libs/imagekit");
const path = require("path");

module.exports = {
  store: async (req, res, next) => {
    try {
      let { first_name, last_name, email, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
          status: false,
          message: "Input must be required!",
        });
      }

      let exist = await prisma.user.findFirst({
        where: { email },
      });

      if (exist) {
        return res.status(401).json({
          status: false,
          message: "Email already used!",
        });
      }
      let encryptedPassword = await bcrypt.hash(password, 10);
      let user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          email,
          password: encryptedPassword,
        },
      });
      delete user.password;

      res.status(200).json({
        status: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  index: async (req, res, next) => {
    try {
      const { search } = req.query;

      const users = await prisma.user.findMany({
        where: { first_name: { contains: search, mode: "insensitive" } },
      });

      users.map((user) => {
        delete user.password;
      });

      res.status(200).json({
        status: true,
        message: "OK",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      let id = Number(req.params.id);

      const users = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!users) {
        return res.status(404).json({
          status: false,
          message: `Can't find user with ID ${id}`,
          data: null,
        });
      }

      delete users.password;

      res.status(200).json({
        status: true,
        message: "OK",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const { first_name, last_name, email, address, occupation } = req.body;

      if (!first_name && !last_name && !email && !address && !occupation) {
        return res.status(400).json({
          status: false,
          message: "At least one Input must be required",
        });
      }

      const exist = await prisma.user.findUnique({ where: { id } });

      if (!exist) {
        return res.status(404).json({
          status: false,
          message: `Can't find user with ID ${id}`,
          data: null,
        });
      }

      const users = await prisma.user.update({
        where: { id },
        data: {
          first_name,
          last_name,
          email,
          address,
          occupation,
        },
      });
      delete users.password;

      res.status(200).json({
        status: true,
        message: "Update user successfully!",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  avatar: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      let strFile = req.file.buffer.toString("base64");
      let { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });

      const exist = await prisma.user.findUnique({
        where: { id },
      });

      if (!exist) {
        return res.status(404).json({
          status: false,
          message: `User with id ${id} not found`,
          data: null,
        });
      }

      const users = await prisma.user.update({
        where: { id },
        data: { avatar_url: url },
      });
      delete users.password;

      res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const users = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!users) {
        return handleError(res, 404, `User with ID ${id} not found`);
      }

      await prisma.user.delete({
        where: { id: id },
      });

      res.status(200).json({
        status: true,
        message: `User with ID ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
};
