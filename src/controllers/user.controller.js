import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req,res)=>{
    // steps written by me
//    take payload from the frontend/postman
    // payload:-username, email, fullname, avatar, coverImage, password

    // check username is already exits

    // check email is already exits

    // store avatar in cloudinary and get the public url

    // store cover image in cloudinary and get the public url

    // save the user

    // chai aur code steps
    // get user details from the frontend/postman

    // validations - not empty, right format

    // check if user already exits or not with both username and email fields

    // check both avatar and cover image sent by the frontend or not

    // if exist then upload them to cloudinary and check avatar successfully uploaded to cloudinary or not

    // create user object, then create entry in db

    // check if user successfully saved in db

    // remove password and refresh token fields from response which is recieved from db

    // return response

    const {fullname,email,username,password}=req.body
    console.log("email: ",email)

    if([fullname,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

   const existedUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser) throw new ApiError(409,"User with email or username already exists")

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) throw new ApiError(400,"Avatar file is required")

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) throw new ApiError(500,"Something went wrong while registering the user")

    return res.status(201).json(new ApiResponse(201,createdUser,"User registered successfully"))
})

export {
    registerUser
}