import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IVaultItem extends Document {
  userId: Types.ObjectId
  ciphertext: string
  iv: string
  createdAt: Date
  updatedAt: Date
}

const VaultItemSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  ciphertext: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Prevent re-compilation in development
const VaultItem = mongoose.models.VaultItem || mongoose.model<IVaultItem>('VaultItem', VaultItemSchema)

export default VaultItem