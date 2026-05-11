import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { UserModel } from '../models/UserModel';

export class MongoUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return { id: user._id.toString(), name: user.name, email: user.email, password: user.password, role: user.role as any };
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return { id: user._id.toString(), name: user.name, email: user.email, role: user.role as any };
  }

  async save(user: User): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return { ...user, id: newUser._id.toString() };
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(u => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role as any }));
  }

  async updatePassword(email: string, passwordHash: string): Promise<boolean> {
    const res = await UserModel.updateOne(
      { email }, 
      { 
        password: passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null 
      }
    );
    return res.modifiedCount > 0;
  }

  async saveResetToken(email: string, token: string, expires: Date): Promise<void> {
    await UserModel.updateOne({ email }, { resetPasswordToken: token, resetPasswordExpires: expires });
  }

  async findByResetToken(token: string): Promise<User | null> {
    const u = await UserModel.findOne({ resetPasswordToken: token });
    if (!u) return null;
    return {
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      password: u.password,
      role: u.role as any,
      resetPasswordToken: u.resetPasswordToken,
      resetPasswordExpires: u.resetPasswordExpires
    };
  }
}
