const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    role: String,

})

const saltRounds = 10;

userSchema.pre('save', function (next) {
    if (!this.isModified('passwordHash')) {
        return next(); // пароль не міняли — пропускаємо хешування
    }

    bcrypt.hash(this.passwordHash, saltRounds, (err, hash) => {
        if (err) {
            return next(err);
        }else {
            this.passwordHash = hash;
            next()
        }
    })
});

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel;