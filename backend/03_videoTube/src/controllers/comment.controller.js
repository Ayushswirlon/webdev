import mongoose, { isValidObjectId, mongo } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const getVideoComments = AsyncHandler(async (req, res) => {
  try {
    // Extract parameters with default values
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortType = "desc",
    } = req.query;
    const { videoId } = req.params;

    // Convert string values to integers
    page = parseInt(page);
    limit = parseInt(limit);
    const sortDirection = sortType === "asc" ? 1 : -1;

    // Validate videoId
    if (!isValidObjectId(videoId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid video ID"));
    }

    // Define match stage
    const matchStage = { video: new mongoose.Types.ObjectId(videoId) };

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      { $sort: { [sortBy]: sortDirection } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    // Fetch comments using aggregation
    const comments = await Comment.aggregate(pipeline);

    // Get total comment count for pagination metadata
    const totalComments = await Comment.countDocuments(matchStage);
    const totalPages = Math.ceil(totalComments / limit);

    // Return response
    res.status(200).json(
      new ApiResponse(
        200,
        {
          comments,
          pagination: {
            page,
            totalPages,
            totalComments,
          },
        },
        "Comments fetched successfully"
      )
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

const addComment = AsyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"));
  }

  if (!content.trim()) {
    return res.status(400).json(new ApiError(400, "Content is required"));
  }

  try {
    let comment = new Comment({
      content,
      video: videoId,
      owner: req.user._id,
    });

    await comment.save(); // Save comment first
    await comment.populate("owner", "fullname username avatar"); // Populate owner details

    return res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment added successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const updateComment = AsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    return res.status(400).json(new ApiError(400, "Invalid comment ID"));
  }

  if (!content || !content.trim()) {
    return res.status(400).json(new ApiError(400, "Content is required"));
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content: content.trim() }, // Ensure no extra spaces
      { new: true } // Returns the updated comment
    );

    if (!updatedComment) {
      return res.status(404).json(new ApiError(404, "Comment not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const deleteComment = AsyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    return res.status(400).json(new ApiError(400, "Invalid comment ID"));
  }

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json(new ApiError(404, "Comment not found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedComment, "Comment deleted successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
