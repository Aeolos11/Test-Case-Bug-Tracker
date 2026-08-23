const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {type: String, required: true, unique: true, lowercase: true, trim: true,},
    passwordHash: { type: String, required: true },
    role: { type: String,  default:`tester`, trim: true, enum: [`admin`, `tester`, `developer`] },

})

const saltRounds = 10;

userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) {
        return;
    }

    const hash = bcrypt.hash(this.passwordHash, saltRounds)
    this.passwordHash = hash


});

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel;