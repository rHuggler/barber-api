import { Document, model, Schema } from 'mongoose';

const NotificationSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Number,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

interface INotification extends Document {
  content: string;
  user: number;
  read?: boolean;
}

export default model<INotification>('Notification', NotificationSchema);
