import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const generatingAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) { throw new ApiError(400, "User Not Found") }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    }
    catch (err) {
        throw new ApiError(500, "Something Went Wrong While Generating Access And Refresh Tokens")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const { email, username, fullName, password } = req.body
    // console.log(email)

    if ([email, username, password, fullName].some((field) =>
        field?.trim() === ""
    )) {
        throw new ApiError(400, "All Fields Are Required")
    }


    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (user) {
        throw new ApiError(400, "User with email or username is already exists")
    }

    const createdUser = await User.create({ username, email, fullName, password })

    res
        .status(201).json(
            new ApiResponse(201, createdUser, "User Has Been Registered Successfully")
        )



});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields Are Required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Credentials")
    }

    const userId = user._id

    const { refreshToken, accessToken } = await generatingAccessAndRefreshTokens(userId)

    return res.status(200).json(
        new ApiResponse(200, { accessToken, refreshToken }, "You are loged In!")
    )
});
const LogOutUser = asyncHandler(async (req, res) => {
 await   User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true

        }
    )
    const options = {
        httpsOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User Loged Out Successfully")
        )
});
export {
    registerUser,
    loginUser,
    LogOutUser
}