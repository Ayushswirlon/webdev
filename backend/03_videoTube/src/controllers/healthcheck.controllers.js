import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const healthcheck = AsyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, "ok", "healthcheck passed"));
});

export { healthcheck };