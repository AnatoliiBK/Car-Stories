const bcrypt = require("bcrypt");
const User = require("../models/user");
const Joi = require("joi");
const express = require("express");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already Exists");

  console.log("here");

  const { name, email, password } = req.body;

  user = new User({ name, email, password });

  // const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, 10);

  await user.save();

  const token = generateAuthToken(user);

  res.json(token);
});

module.exports = router;
