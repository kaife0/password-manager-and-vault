import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  encryptionSalt: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  encryptionSalt: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Prevent re-compilation in development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User