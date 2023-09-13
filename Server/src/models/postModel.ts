import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  // Define user properties here
}

interface IPost extends Document {
  body: string;
  photo: string; // URL or path to the photo
  video: string; // URL or path to the video
  likes: IUser['_id'][];
  comments: {
    comment: string;
    postedBy: IUser['_id'];
  }[];
  postedBy: IUser['_id'];
}

const postsSchema: Schema<IPost> = new Schema<IPost>({
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  video: {
    type: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'USER',
    },
  ],
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'USER',
  },
});

const PostModel: Model<IPost> = mongoose.model<IPost>('POSTS', postsSchema);
export default PostModel;