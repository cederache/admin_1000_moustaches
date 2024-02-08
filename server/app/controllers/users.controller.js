const admin = require("firebase-admin");
const Users = require("../models/users.model.js");

// Create and Save a new Users
exports.create = async (req, res) => {
  const { email, password, firstname, name } = req.body;

  const user = await admin.auth().createUser({
    email: email,
    password: password,
    displayName: `${firstname} ${name}`,
  });

  Users.create(req.body, (err, data) => {
    if (err) {
      admin.auth().deleteUser(user.uid);

      res.status(500).send({
        message: err.message || "Some error occurred while creating a user.",
      });
    } else res.send(data);
  });
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  Users.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving host users.",
      });
    else res.send(data);
  });
};

// Find a single Users with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Users.findById(id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving user with id ${id}.`,
      });
    else res.send(data);
  });
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Users.updateById(id, req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while updating user with id ${id}.`,
      });
    else res.send(data);
  });
};

// Delete a Users with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Users.remove(id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while deleting user with id ${id}.`,
      });
    else res.send(data);
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
