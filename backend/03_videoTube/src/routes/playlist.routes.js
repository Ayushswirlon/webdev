import { Router } from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

//secured routes
router.route("/create").post(verifyJWT, createPlaylist);
router.route("/user/:userId").get(verifyJWT, getUserPlaylists);
router.route("/:playlistId").get(verifyJWT, getPlaylistById);
router
  .route("/add-video-to-playlist/:videoId/:playlistId")
  .post(verifyJWT, addVideoToPlaylist);
router
  .route("/remove-video-from-playlist/:videoId/:playlistId")
  .post(verifyJWT, removeVideoFromPlaylist);
router.route("/delete/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/update/:playlistId").patch(verifyJWT, updatePlaylist);

export default router;
