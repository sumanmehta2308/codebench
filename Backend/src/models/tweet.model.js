const mongoose = require("mongoose");
const { Schema } = mongoose;

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    replyOf: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = { Tweet };