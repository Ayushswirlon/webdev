import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/").get(verifyJWT, getChannelStats);
router.route("/videos").get(verifyJWT, getChannelVideos);

export default router;
