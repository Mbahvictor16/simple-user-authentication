const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const user = require("./models/user");
const { authUser, setUser } = require("./auth/auth");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(setUser);

mongoose.connect("mongodb://127.0.0.1/astore");

app.set("view engine", "ejs");

app.get("/", authUser, (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  const { email, password, id } = req.body;

  try {
    if (email && password) {
      const trimEmail = email.trim().toLowerCase();
      const trimPassword = password.trim();

      const findUser = await user.findOne({ email: trimEmail });

      if (findUser) {
        if (await bcrypt.compare(trimPassword, findUser.password)) {
          res.cookie("id", findUser._id);
          return res.json({
            message: "Signed in successfully",
            id: findUser._id,
          });
        } else {
          return res.json({ message: "Password is inccorrect" });
        }
      } else {
        return res.json({ message: "No user with this email exist" });
      }
    } else {
      return res.json({
        message: "Please fill in the required field to sign in",
      });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (firstName && lastName && email && password) {
      const trimFname = firstName.trim();
      const trimLname = lastName.trim();
      const trimEmail = email.trim().toLowerCase();
      const trimPassword = password.trim();

      const findUser = await user.findOne({ email: trimEmail });

      if (findUser) {
        return res.json({ message: "A user with this eamil already exists" });
      } else {
        const hashPassword = await bcrypt.hash(trimPassword, 10);

        const newUser = await user.create({
          firstName: trimFname,
          lastName: trimLname,
          email: trimEmail,
          password: hashPassword,
        });

        await newUser.save();

        return res.json({ id: newUser._id });
      }
    } else {
      return res.json({ message: "Please fill out the required field" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
});

app.listen(5178, () => {
  console.log("app is running on http://localhost:5178");
});
