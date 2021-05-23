const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/Users");

// @route   POST api/users
// @desc    register route
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email address").isEmail(),
    check("password", "Password needs to be 6 or more characters").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // checks if user exists
      let user = await User.findOne({ email });
      if (user){
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password 
      });

      // encrypt password
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(password, salt);
     await user.save();

      // return jsonwebtoken
      // jwt.sign(payload, secretOrPrivateKey, [options, callback])
      const payload = {
        user: {
          id: user.id 
        }
      }

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 36000 }, (err, token) => {
        if(err) throw err;
        res.json({ token });
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
