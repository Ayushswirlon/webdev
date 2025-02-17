import { Router } from "express";
import {
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideos,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();
//public routes
router.route("/v/:videoId").get(getVideoById);
router.route("/").get(getAllVideos);

//secure routes
router.route("/publish").post(
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);
router
  .route("/update/:videoId")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo);
router.route("/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;
