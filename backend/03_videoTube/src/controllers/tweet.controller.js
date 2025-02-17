import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweets.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const createTweet = AsyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const owner = await User.findById(req.user._id);
  if (!owner) {
    throw new ApiError(404, "User not found");
  }

  const tweet = await Tweet.create({ content, owner: owner._id });
  if (!tweet) {
    throw new ApiError(500, "Error while creating tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = AsyncHandler(async (req, res) => {
  // Get user ID from request
  const userId = req.user._id;

  // Fetch tweets directly without extra user lookup
  const tweets = await Tweet.find({ owner: userId }).populate(
    "owner",
    "fullname email avatar username"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully!"));
});

const updateTweet = AsyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content) {
    throw new ApiError(400, "Provide content to update");
  }

  // Check if tweet exists and belongs to the logged-in user
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to update this tweet");
  }

  // Update the tweet
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  ).populate("owner", "fullname email avatar username");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = AsyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  // Check if tweet exists and belongs to the logged-in user
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this tweet");
  }

  // Update the tweet
  const updatedTweet = await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
