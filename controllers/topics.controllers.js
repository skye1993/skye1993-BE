const topicsFunction = require("../models/topics.models");

const getTopics = (req, res) => {
  const queries = req.query;
  topicsFunction.readTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};


module.exports = {
  getTopics,
  
};
