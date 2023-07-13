const mongoose = require("mongoose");
const querySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
      email:{type:String},
      type:{type:String},
      query:{type:String},
      active:{type:Boolean, default: false}
  },
  {
    timestamps: true,
  }
)

const Query = mongoose.model('Query', querySchema)
module.exports = Query
