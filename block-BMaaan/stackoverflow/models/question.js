let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let questionSchema = new Schema(
  {
    title: { type: String, required: true},
    content: { type: String, required: true},
    code:{type: String, required: true },
    result:{type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    answers:[{type: Schema.Types.ObjectId, ref:'Answer'}],
    comments:[{type: Schema.Types.ObjectId, ref:'Comment'}],
  },
  { timestamps: true }
);

questionSchema.index({ title: 'text' }); 
questionSchema.index({ tags: 1 }); 

module.exports = mongoose.model('Question', questionSchema);
