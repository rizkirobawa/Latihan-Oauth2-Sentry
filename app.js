require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const app = express();
const router = require("./routes/v1");

const Sentry = require("./libs/sentry")

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(logger("dev"));
app.use(express.json());
app.use(router);

app.get("/", (req, res) =>
  res.json({
    status: true,
    message: "Hello World!",
    data: users,
    // data: null,
  })
);

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// 500 error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: err.message,
    data: null,
  });
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: `are you lost? ${req.method} ${req.url} is not registered!`,
    data: null,
  });
});

module.exports = app;
