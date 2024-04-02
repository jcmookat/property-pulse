import { Schema, model, models } from 'mongoose';

const UserSchema = new Scheme(
	{
		email: {
			type: String,
			unique: [true, 'Email already exists'],
			required: [true, 'Email is required'],
		},
		usernames: {
			type: String,
			required: [true, 'Username is requires'],
		},
		image: {
			type: String,
		},
		bookmarks: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Property', ////reference to Property model where we will get the ids
			},
		],
	},
	{
		timestamps: true,
	},
);

const User = models.User || model('User', UserSchema);

export default User;
