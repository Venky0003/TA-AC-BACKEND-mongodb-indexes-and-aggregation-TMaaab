let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: String,
  description: String,
  tags: [String],
});

// multikey index on tags
articleSchema.index({ tags: 1 });

// text indexes
articleSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Article', articleSchema);