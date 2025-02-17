import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const toggleVideoLike = AsyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"));
  }

  try {
    const existingLike = await Like.findOne({
      video: videoId,
      likedBy: req.user._id,
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
    }

    const newLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });

    return res.status(200).json(new ApiResponse(200, newLike, "Like added"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const toggleCommentLike = AsyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    return res.status(400).json(new ApiError(400, "Invalid comment ID"));
  }

  try {
    const existingLike = await Like.findOne({
      comment: commentId,
      likedBy: req.user._id,
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
    }

    const newLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });

    return res.status(200).json(new ApiResponse(200, newLike, "Like added"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const toggleTweetLike = AsyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    return res.status(400).json(new ApiError(400, "Invalid tweet ID"));
  }

  try {
    const existingLike = await Like.findOne({
      tweet: tweetId,
      likedBy: req.user._id,
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
    }

    const newLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });

    return res.status(200).json(new ApiResponse(200, newLike, "Like added"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const getLikedVideos = AsyncHandler(async (req, res) => {
  try {
    const likedVideos = await Like.find({ likedBy: req.user._id }).populate(
      "video"
    );

    if (likedVideos.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No liked videos found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, likedVideos, "Liked videos retrieved successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
