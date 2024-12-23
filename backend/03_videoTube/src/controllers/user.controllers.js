import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = AsyncHandler(async (req, res) => {
  //todo
  //extract the user data from req.body
  const { fullname, email, username, password } = req.body;

  // validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //finding whether the user existed previously or no
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new ApiError(400, "User with username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Image is required");
  }

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is required");
  }

  let avatar, coverImage;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("image uploaded successfully", avatar);
  } catch (error) {
    throw new ApiError(500, "Error while uploading avatar image");
  }

  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("image uploaded successfully", coverImage);
  } catch (error) {
    throw new ApiError(500, "Error while uploading cover image");
  }

  try {
    const user = await User.create({
      fullname,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatar.url || "",
      coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    console.log("User connection failed");
    if (avatar) {
      await deleteOnCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteOnCloudinary(coverImage.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while registering user and deleting images"
    );
  }
});

export { registerUser };
