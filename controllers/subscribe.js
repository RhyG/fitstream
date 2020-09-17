const jwt = require("jsonwebtoken");

const db = require("../db/connection");
const { user: User } = require("../db/models");
const { extractToken } = require("../lib/extractToken");

const subscribeToChannel = async (req, res) => {
  const token = extractToken(req);
  const {
    user: { id },
  } = jwt.decode(token);

  let channelSubscription;

  try {
    channelSubscription = await User.findOne({
      where: {
        id: req.params.id,
      },
    }).catch((err) => {
      console.log(err);
      throw {
        message: "Error fetching channel.",
      };
    });
  } catch (error) {
    return res.status(500).send(error);
  }

  if (!channelSubscription) {
    return res.status(404).send({ message: "Can't subscribe to a channel that doesn't exist." });
  }

  if (id === channelSubscription.id) {
    return res.status(401).send("Can't subscribe to your own channel");
  }

  try {
    if (channelSubscription.followers.includes(id)) {
      const newArr = channelSubscription.followers.filter((x) => x !== id);

      await channelSubscription.update({
        followers: newArr,
      });

      return res.send({ status: "Success", message: "Unsubscribed" });
    } else {
      await channelSubscription.update({
        followers: db.fn("array_append", db.col("followers"), id),
      });
      return res.send({ status: "Success", message: "Subscribed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  subscribeToChannel,
};
