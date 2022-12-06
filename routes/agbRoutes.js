// Importing the express module to use router class
const express = require("express");

// Instance of the router class -> used to call all endpoints/routes of the application
const router = express.Router();
const controller = require("../controllers/agbController.js");
const { signin } = require("../auth/auth");
const { verify } = require("../auth/auth");

// Using the router instance to implement the request handler for HTTP GET requests to the root and other webpages of the application
router.get("/", verify, controller.home);
router.get("/about", controller.about_page);
/* router.get("/signup", controller.register);
router.post("/signup", controller.post_register); */
router.get("/signin", controller.login);
router.post("/signin", controller.signin);
router.get("/signout", verify, controller.logout);
router.get("/wellness", verify, controller.wellness_page);

// Unregistered user interface
router.get("/unreg", controller.unreg_home);
router.get("/unreg_about", controller.unreg_about_page);
router.get("/unreg_signup", controller.alt_register);
router.post("/unreg_signup", controller.alt_post_register);

// Manager user interface
router.get("/mgmt", controller.manager_view);

// Manager CRUD operations
router.get("/staffinfo", controller.agb_staff);
router.post("/addStaff", controller.post_add);
router.post("/updateStaff", controller.post_update);
router.post("/deleteStaff", controller.post_delete);
router.get("/viewStaff", controller.view_Staff);

// Goals for wellness program
router.get("/wellness", controller.wellness_page);
router.get("/goals", controller.goals);
router.post("/addrow", controller.post_addrow);
router.post("/deleterow", controller.post_deleterow);
router.get("/deletedgoal", controller.deleted_goal);
router.post("/updaterow", controller.post_updaterow);

// Client server error response implemented with router.use() method
router.use(function (req, res) {
  res.status(404);
  res.type("text/plain");
  res.send("404 Not found.");
});

// Internal server error response implemented with router.use() method
router.use(function (err, req, res, next) {
  res.status(500);
  res.type("text/plain");
  res.send("Internal Server Error.");
});

// Making the new router code accessible to index.js and all files
module.exports = router;
