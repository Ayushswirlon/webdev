import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = AsyncHandler(async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      query = "",
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    sortType = sortType === "asc" ? 1 : -1;

    const matchStage = { isPublished: true };

    if (query) {
      matchStage.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (userId && isValidObjectId(userId)) {
      matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    const aggregateQuery = Video.aggregate([{ $match: matchStage }]).sort({
      [sortBy]: sortType,
    });

    const options = {
      page,
      limit,
      sort: { [sortBy]: sortType },
    };

    const videos = await Video.aggregatePaginate(aggregateQuery, options);

    res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {}, "Something went wrong"));
  }
});

const publishAVideo = AsyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    //get video upload it on cloudinary and save it to database
    if (!title || !description) {
      throw new ApiError(400, "title and description are required");
    }

    const videoFilePath = req.files.video[0].path;
    if (!videoFilePath) {
      throw new ApiError(400, "video file is required");
    }
    const videoFile = await uploadOnCloudinary(videoFilePath, "video");
    if (!videoFile) {
      throw new ApiError(500, "something went wrong while uploading video");
    }
    const thumbnailFilePath = req.files.thumbnail[0].path;

    if (!thumbnailFilePath) {
      throw new ApiError(400, "thumbnail file is required");
    }

    const thumbnailFile = await uploadOnCloudinary(thumbnailFilePath, "image");
    if (!thumbnailFile) {
      throw new ApiError(500, "something went wrong while uploading thumbnail");
    }

    const owner = await User.findById(req.user._id);
    if (!owner) {
      throw new ApiError(404, "user not found");
    }
    const duration = videoFile?.duration;
    const video = await Video.create({
      title,
      description,
      duration,
      owner: owner?._id,
      thumbnail: thumbnailFile?.url,
      videoFile: videoFile?.url,
      isPublished: true,
    });

    const publishedVideo = await Video.findById(video._id);
    if (!publishedVideo) {
      throw new ApiError(404, "Video not uploaded successfully");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, publishedVideo, "Video uploaded successfully")
      );
  } catch (error) {
    throw new ApiError(400, "something went wrong", error);
  }
});

const getVideoById = AsyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "invalid video id");
    }
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(new ApiResponse(200, video, "Video found"));
  } catch (error) {
    throw new ApiError(400, "something went wrong", error);
  }
});

const updateVideo = AsyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    // TODO: update video details like title, description, thumbnail
    const { title, description } = req.body;

    console.log(title, description, videoId);

    let thumbnailFile;
    if (req.file?.path) {
      const thumbnail = req.file.path;

      // Upload only if a new thumbnail is provided
      thumbnailFile = await uploadOnCloudinary(thumbnail, "image");
      if (!thumbnailFile) {
        throw new ApiError(
          500,
          "Something went wrong while uploading thumbnail"
        );
      }
    }

    if (!title && !description && !thumbnailFile) {
      throw new ApiError(400, "Nothing to update");
    }

    // Fetch current video to retain old values if necessary
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title: title || undefined,
          description: description || undefined,
          thumbnail: thumbnailFile?.url || undefined,
        },
      },
      { new: true } // Return updated document
    );

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video updated successfully"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong", error);
  }
});

const deleteVideo = AsyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = AsyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle publish status

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  } else {
    video.isPublished = !video.isPublished;
    await video.save();
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Publish status toggled successfully"));
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
