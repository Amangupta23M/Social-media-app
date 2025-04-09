import mongoose from 'mongoose';
const PostSchema = new mongoose.Schema(
    {
  userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
    },
    desc:{
        type:String,
    },
    img:{
        type:String,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    comments:[
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
    ]
  },
    { timestamps: true }
    
)
export default mongoose.model('Post', PostSchema);