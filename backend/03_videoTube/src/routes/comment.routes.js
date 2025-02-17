import {
  addComment,
  getVideoComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/:videoId").post(verifyJWT, addComment);
router.route("/video/:videoId").get(verifyJWT, getVideoComments);
router.route("/:commentId").patch(verifyJWT, updateComment);
router.route("/:commentId").delete(verifyJWT, deleteComment);
export default router;
