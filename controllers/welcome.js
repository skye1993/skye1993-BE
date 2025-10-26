exports.welcome = (req, res) => {
  res.status(200).send({ msg: "Hello from Express Server" });
};