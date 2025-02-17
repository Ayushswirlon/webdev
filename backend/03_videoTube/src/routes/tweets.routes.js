import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/t/createTweet").post(verifyJWT, createTweet);
router.route("/t/user/tweets").get(verifyJWT, getUserTweets);
router.route("/t/updateTweet/:tweetId").patch(verifyJWT, updateTweet);
router.route("/t/deleteTweet/:tweetId").delete(verifyJWT, deleteTweet);

export default router;
