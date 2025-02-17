import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const toggleSubscription = AsyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed successfully"));
  }

  try {
    const subscription = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, subscription, "Subscribed successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while toggling subscription");
  }
});

const getUserChannelSubscribers = AsyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  try {
    const subscriberList = await Subscription.find({ channel: channelId })
      .populate("subscriber", "fullname username avatar")
      .lean();

    return res
      .status(200)
      .json(
        new ApiResponse(200, subscriberList, "Subscribers fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching subscriber list");
  }
});

const getSubscribedChannels = AsyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  try {
    const channelList = await Subscription.find({ subscriber: subscriberId })
      .populate("channel", "fullname username avatar")
      .lean();

    return res
      .status(200)
      .json(new ApiResponse(200, channelList, "Channels fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching subscribed channels");
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
