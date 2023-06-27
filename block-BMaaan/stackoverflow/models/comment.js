let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
