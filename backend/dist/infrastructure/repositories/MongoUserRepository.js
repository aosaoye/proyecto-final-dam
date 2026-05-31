"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUserRepository = void 0;
const UserModel_1 = require("../models/UserModel");
class MongoUserRepository {
    async findByEmail(email) {
        const user = await UserModel_1.UserModel.findOne({ email });
        if (!user)
            return null;
        return { id: user._id.toString(), name: user.name, email: user.email, password: user.password, role: user.role };
    }
    async findById(id) {
        const user = await UserModel_1.UserModel.findById(id);
        if (!user)
            return null;
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    }
    async save(user) {
        const newUser = new UserModel_1.UserModel(user);
        await newUser.save();
        return { ...user, id: newUser._id.toString() };
    }
    async findAll() {
        const users = await UserModel_1.UserModel.find();
        return users.map(u => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role }));
    }
    async updatePassword(email, passwordHash) {
        const res = await UserModel_1.UserModel.updateOne({ email }, {
            password: passwordHash,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });
        return res.modifiedCount > 0;
    }
    async saveResetToken(email, token, expires) {
        await UserModel_1.UserModel.updateOne({ email }, { resetPasswordToken: token, resetPasswordExpires: expires });
    }
    async findByResetToken(token) {
        const u = await UserModel_1.UserModel.findOne({ resetPasswordToken: token });
        if (!u)
            return null;
        return {
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            password: u.password,
            role: u.role,
            resetPasswordToken: u.resetPasswordToken,
            resetPasswordExpires: u.resetPasswordExpires
        };
    }
}
exports.MongoUserRepository = MongoUserRepository;
