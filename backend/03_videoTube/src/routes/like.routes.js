import { Router } from "express";
import {
  toggleVideoLike,
  toggleTweetLike,
  toggleCommentLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/video/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/comment/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/video/likedVideos").get(verifyJWT, getLikedVideos);

export default router;
