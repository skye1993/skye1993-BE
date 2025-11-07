const usersFunction = require("../models/users.models");

const getUsers = (req, res) => {
  const queries = req.query;
  usersFunction.readUsers().then((users) => {
    res.status(200).send({ users });
  });
};

module.exports = {
  getUsers,
};
