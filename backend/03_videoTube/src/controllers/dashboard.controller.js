import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const getChannelStats = AsyncHandler(async (req, res) => {
  const userId = req.user._id; // Fix userId extraction

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  try {
    // Fetch all videos owned by the user
    const userVideos = await Video.find({ owner: userId });

    const totalVideos = userVideos.length;
    const totalViews = userVideos.reduce(
      (sum, video) => sum + (video.views || 0),
      0
    );

    const totalSubscribers = await Subscription.countDocuments({
      channel: userId,
    });

    const totalLikes = await Like.countDocuments({
      video: { $in: userVideos.map((v) => v._id) },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalVideos, totalViews, totalSubscribers, totalLikes },
          "Channel stats retrieved successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const getChannelVideos = AsyncHandler(async (req, res) => {
  // Extract user ID from request
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  try {
    // Fetch all videos uploaded by the user (channel owner)
    const videos = await Video.find({ owner: userId }).sort({ createdAt: -1 });

    if (videos.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No videos found for this channel"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos retrieved successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

export { getChannelStats, getChannelVideos };
