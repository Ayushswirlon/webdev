import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";

const createPlaylist = AsyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;

    //TODO: create playlist
    const userId = req.user._id;
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "invalid request");
    }
    const existingPlaylist = await Playlist.findOne({ name, owner: userId });
    if (existingPlaylist) {
      throw new ApiError(400, "A playlist with this name already exists.");
    }
    const playlist = await Playlist.create({
      name,
      description,
      owner: userId,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, playlist, "user created successfully!!"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getUserPlaylists = AsyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Fetch playlists with populated owner details
  const playlists = await Playlist.find({ owner: userId })
    .populate("owner", "fullname username avatar")
    .lean();
  // Check if user has playlists
  if (playlists.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No playlists found for this user"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully!")
    );
});

const getPlaylistById = AsyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // Validate if playlistId is a valid MongoDB ObjectId
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  // Fetch the playlist and populate owner & songs if needed
  const playlist = await Playlist.findById(playlistId)
    .populate("owner", "fullname username avatar") // Populate owner details
    .populate({
      path: "videos",
      select: "title url thumbnail duration", // Select only necessary fields
    });
  if (!playlist) {
    return res.status(404).json(new ApiResponse(404, {}, "Playlist not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist found!"));
});

const addVideoToPlaylist = AsyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  // Validate MongoDB ObjectIds
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }

  // Find the playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Find the video
  const videoToAdd = await Video.findById(videoId);
  if (!videoToAdd) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the video is already in the playlist
  if (playlist.videos.some((vid) => vid.toString() === videoId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Video already in playlist"));
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You do not have permission to modify this playlist."
    );
  }

  // Add video ObjectId to playlist and save
  playlist.videos.push(videoToAdd._id);
  await playlist.save();

  // Populate the updated playlist with error handling
  try {
    const populatedPlaylist = await Playlist.findById(playlistId)
      .populate("owner", "fullname username avatar") // Select owner fields
      .populate("videos", "title url thumbnail duration"); // Select video fields

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          populatedPlaylist,
          "Video added to playlist successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error populating playlist data");
  }
});

const removeVideoFromPlaylist = AsyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  const videoToRemove = await Video.findById(videoId);
  if (!videoToRemove) {
    throw new ApiError(404, "Video not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You do not have permission to modify this playlist."
    );
  }

  playlist.videos = playlist.videos.filter((vid) => vid.toString() !== videoId);
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video removed from playlist successfully")
    );
});

const deletePlaylist = AsyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  const playlistFind = await Playlist.findById(playlistId);
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You do not have permission to modify this playlist."
    );
  }

  if (!playlistFind) {
    throw new ApiError(404, "Playlist not found");
  }
  const playlist = await Playlist.findByIdAndDelete(playlistId);
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

const updatePlaylist = AsyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!name && !description) {
    throw new ApiError(400, "Provide at least one field to update.");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { name, description },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatePlaylist, "Playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
