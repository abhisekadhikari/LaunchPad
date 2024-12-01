import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    githubId: String,
    username: String,
    displayName: String,
    profileUrl: String,
    email: String,
    provider: String,
    avatar_url: String,
})
/* 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10) // Generate a salt
        this.password = await bcrypt.hash(this.password, salt) // Hash the password
        next()
    } catch (err) {
        next(err)
    }
})
 */
const User = mongoose.model("User", userSchema)

export default User
