// Setting up the database
const nedb = require("nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// This class implements the operations that the application requires for the processing of the data.
class fashion {
  // Creating the constructor which allows us create an instance of the data model in one of two modes.
  // Instantiating the database in the constructor
  constructor(newStaff) {
    if (newStaff) {
      this.db = new nedb({ filename: newStaff, autoload: true });
      console.log("DB connected to " + newStaff);
    } else {
      this.db = new nedb(); // Persistence
    }
  }

  addStaff(fullname, email, password) {
    const that = this;
    bcrypt.hash(password, saltRounds).then(function (hash) {
      let staff = {
        user: fullname,
        email: email,
        password: hash,
      };
      that.db.insert(staff, function (err) {
        if (err) {
          console.log("Can't insert user: ", fullname);
        }
      });
    });
  }

  lookup(user, cb) {
    this.db.find({ user: user }, function (err, entries) {
      if (err) {
        return cb(null, null);
      } else {
        if (entries.length == 0) {
          return cb(null, null);
        }
        return cb(null, entries[0]);
      }
    });
  }

  loginLookup(email, cb) {
    this.db.find({ email: email }, function (err, entries) {
      if (err) {
        return cb(null, null);
      } else {
        if (entries.length == 0) {
          return cb(null, null);
        }
        return cb(null, entries[0]);
      }
    });
  }

  mgmtaddStaff(fullname, email) {
    let staff = {
      fullname: fullname,
      email: email,
    };
    console.log("Entry created", staff);
    this.db.insert(staff, function (err, doc) {
      if (err) {
        console.log("Error inserting document", fullname);
      } else {
        console.log("Document inserted into the database", doc);
      }
    });
  }

  updateStaff(fullname, email) {
    if (this.db.find({ fullname: fullname })) {
      this.db.update({ fullname, fullname }, { $set: { email: email } });
      console.log("Document updated from the database");
    } else {
      console.log("Error updating document");
    }
  }

  updateGoal(name, wellness, goal, date) {
    let upd = {
      name: name,
      wellness: wellness,
      goal: goal,
      date: date,
    };
    db.update(
      { goal: goal },
      { $set: { name: name, wellness: wellness, goal: goal, date: date } },
      { multi: true },
      function (err, doc) {
        if (err) {
          console.log("Error updating document", upd);
        } else {
          console.log("Document updated", doc);
        }
      }
    );
  }

  deleteStaff(fullname, email) {
    let staff = {
      fullname: fullname,
      email: email,
    };
    this.db.remove({ email: email }, {}, function (err, doc) {
      if (err) {
        console.log("Error deleting document", email);
      } else {
        console.log("Document deleted from the database", doc);
      }
    });
  }

  // A function to return all entries from the database and print to terminal
  getAllStaff() {
    // Return a Promise object, which can be resolved or rejected
    return new Promise((resolve, reject) => {
      // Use the find() function of the database to get the data
      // Error first callback function, err for error, entries for data
      this.db.find({}, function (err, newStaff) {
        // If error occurs reject Promise
        if (err) {
          reject(err);
          // If no error resolve the promise & return the data
        } else {
          resolve(newStaff);
          // To see what the returned data looks like
          console.log("function all() returns: ", newStaff);
        }
      });
    });
  }

  // Wellness goals
  addGoal(name, wellness, goal, date) {
    let add = {
      name: name,
      wellness: wellness,
      goal: goal,
      date: date,
    };
    console.log("Entry created", add);
    this.db.insert(add, function (err, doc) {
      if (err) {
        console.log("Error inserting document", name);
      } else {
        console.log("Document inserted into the database", doc);
      }
    });
  }

  deleteGoal(name, wellness, goal, date) {
    let del = {
      name: name,
      wellness: wellness,
      goal: goal,
      date: date,
    };
    this.db.remove({ name: name }, {}, function (err, doc) {
      if (err) {
        console.log("Error deleting document", del);
      } else {
        console.log("Document deleted from the database", doc);
      }
    });
  }

  // NOT WORKING YET
  /*   updateGoal(name, wellness, goal, date) {
    let upd = {
      name: name,
      wellness: wellness,
      goal: goal,
      date: date,
    };
    db.update(
      { goal: goal },
      { $set: { name: name, wellness: wellness, goal: goal, date: date } },
      { multi: true },
      function (err, doc) {
        if (err) {
          console.log("Error updating document", upd);
        } else {
          console.log("Document updated", doc);
        }
      }
    );
  } */
}

module.exports = fashion;
