import {
  getUserChannelSubscribers,
  getSubscribedChannels,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/user/:subscriberId").get(verifyJWT, getSubscribedChannels); //list of channels user has subscribed to
router.route("/channel/:channelId").get(verifyJWT, getUserChannelSubscribers); //list of subscribers of a channel
router.route("/:channelId").post(verifyJWT, toggleSubscription); //toggle subscription
export default router;
