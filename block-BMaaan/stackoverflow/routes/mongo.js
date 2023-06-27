
db.questions.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: null, tags: { $addToSet: '$tags' } } },
]);

db.questions.aggregate([{ $group: { _id: null, count: { $sum: 1 } } }]);

db.questions.aggregate([
  { $project: { _id: 1, answerCount: { $size: '$answers' } } },
]);

db.users.aggregate([
    { $match: { _id: ObjectId("userId") } },
    { $group: { _id: null, totalReputation: { $sum: "$reputation" } } }
  ]);