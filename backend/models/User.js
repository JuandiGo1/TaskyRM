import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},

})

// DECLARE MONGO MODEL
const UserModel = model<UserType>("User", UserSchema);

export { UserSchema,UserModel }