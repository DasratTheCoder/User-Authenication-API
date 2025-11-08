import { asyncHandler } from "../utils/AyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import jwt from "jsonwebtoken";
import { User } from '../models/user.models.js'


// I Have Made A Arroy Function To Verify That If User Exists Or Not
export const verifyJWT = asyncHandler(async (req, _, next) => {
try {
    // Getting AccessToken and Also Bearer Token
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  if (!token) {
    // If Doen't Have Both Giving A Error
    throw new ApiError(401, "Unauthorized Request")
  }

  // Verifing The Decoded Token By Giving Him A Secret OF Access Token
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  // Finding a user by id
  const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

  if (!user) {
    throw new ApiError(401, "Invalid Access TOken")
  }

  req.user = user
  next()
} catch (error) {
  throw new ApiError(401,"Unauthorized Request")
}
})