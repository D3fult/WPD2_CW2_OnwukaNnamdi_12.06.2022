// This file will process the responses for requested routes
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fashionDAO = require("../model/abgModel");

// Instance of fashionDAO class
const db = new fashionDAO("database/newStaff.db");

// Handlers used to re-direct requests from the specified routes to their static HTML file
exports.home = function (req, res) {
  res.redirect("/index.html");
};

exports.about_page = function (req, res) {
  res.redirect("/html/about.html");
};

exports.login = function (req, res) {
  res.redirect("/html/signin.html");
};

exports.post_login = function (req, res) {
  if (!req.body.email) {
    response.status(400).send("Entries must have an email address.");
    return;
  }
  res.redirect("/");
};

exports.logout = function (req, res) {
  res.clearCookie("jwt").status(200).redirect("/html/logout.html");
};

// ------------------------------------- Unregistered user interface -------------------------------------
exports.unreg_home = function (req, res) {
  res.redirect("../unreg_index.html");
};

exports.unreg_about_page = function (req, res) {
  res.redirect("/html/unreg_about.html");
};

exports.alt_register = function (req, res) {
  res.redirect("/html/unreg_signup.html");
};

exports.alt_post_register = function (req, res) {
  const user = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  if (!user || !email || !password) {
    response
      .status(400)
      .send("Entries must have their fullname, email address, and password.");
    return;
  }
  db.lookup(user, function (err, u) {
    if (u) {
      res.send(401, "User exists:", user);
      return;
    }
    db.addStaff(user, email, password);
    console.log("New user", user, "signed in!");
    res.redirect("/html/signin.html");
  });
};

// ------------------------------------- Manager user interface -------------------------------------
exports.manager_view = function (req, res) {
  res.redirect("/html/mgmt_index.html");
};

// ------------------------------------- Manager CRUD operations -------------------------------------
exports.agb_staff = function (req, res) {
  res.redirect("/html/staff_info.html");
};

exports.post_add = function (req, res) {
  if (!req.body.email) {
    response.status(400).send("Entries must have an email address.");
    return;
  }
  db.mgmtaddStaff(req.body.fullname, req.body.email);
  res.redirect("/html/staff_info.html");
};

exports.post_update = function (req, res) {
  if (!req.body.email) {
    response.status(400).send("Entries must have an email address.");
    return;
  }
  db.updateStaff(req.body.fullname, req.body.email);
  res.redirect("/views/agbstaff");
};

exports.post_delete = function (req, res) {
  if (!req.body.email) {
    response.status(400).send("Entries must have an email address.");
    return;
  }
  db.deleteStaff(req.body.fullname, req.body.email);
  res.redirect("/html/staff_info.html");
};

exports.view_Staff = function (req, res) {
  db.getAllStaff()
    .then((newStaff) => {
      res.render("agbstaff", {
        users: newStaff,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// ------------------------------------- Goals for wellness program -------------------------------------
exports.wellness_page = function (req, res) {
  res.redirect("/html/wellness.html");
};

exports.goals = function (req, res) {
  res.redirect("/html/trialcode.html");
};

exports.post_addrow = function (req, res) {
  if (!req.body.wellness) {
    response
      .status(400)
      .send("You did not provide all the required information.");
    return;
  }
  db.addGoal(req.body.name, req.body.wellness, req.body.goal, req.body.date);
  res.redirect("/html/goal_status.html");
};

exports.post_deleterow = function (req, res) {
  if (!req.body.wellness) {
    response
      .status(400)
      .send("You did not provide all the required information.");
    return;
  }
  db.deleteGoal(req.body.name, req.body.wellness, req.body.goal, req.body.date);
  res.redirect("/html/goal_status.html");
};

exports.deleted_goal = function (req, res) {
  res.redirect("/html/goal_status.html");
};

exports.post_updaterow = function (req, res) {
  if (!req.body.wellness) {
    response
      .status(400)
      .send("You did not provide all the required information.");
    return;
  }
  db.updateGoal(req.body.name, req.body.wellness, req.body.goal, req.body.date);
  res.redirect("../views/agbstaff");
};

exports.signin = function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  db.loginLookup(email, function (err, user) {
    if (err) {
      console.log("error looking up user", err);
      return res.status(401).send();
    }
    if (!user) {
      console.log("user ", email, " not found");
      return res.redirect("html/unreg_signup");
    }
    //compare provided password with stored password
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        //use the payload to store information about the user such as username.
        let payload = { email: user.email };
        //create the access token
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 300,
        });
        res.cookie("jwt", accessToken);
        res.redirect("/");
      } else {
        return res.redirect("/signin"); //res.status(403).send();
      }
    });
  });
};
