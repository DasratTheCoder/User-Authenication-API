import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'

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



})
export {
    registerUser
}