const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressjwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(400).res.json({
        error: "USER email does not exist",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).res.json({
        error: "Email and Password do not match",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    res.cookie("token", token, { expire: new Date() + 9999 });
    //send response to front end
    const { _id, name, email, role } = user;
    return res.josn({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.json({
    message: "User signout",
  });
};
