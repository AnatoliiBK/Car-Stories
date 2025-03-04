const bcrypt = require("bcrypt");
const User = require("../models/user");
const Joi = require("joi");
const express = require("express");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("Invalid Email");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json("Invalid Password");

  const token = generateAuthToken(user);

  res.json(token);
});

module.exports = router;
