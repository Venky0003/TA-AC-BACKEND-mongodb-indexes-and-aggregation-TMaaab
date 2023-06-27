var express = require('express');
var router = express.Router();
var Question = require('../models/question');
var Answer = require('../models/answer');

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  let userId = req.user.id;

  Answer.findById(id).then((answer) => {
    res.render('questionDetails', { answer });
  });
});

// upvotes fetching
router.post('/:id/upvoteanswer', (req, res, next) => {
  let answerId = req.params.id;
  let userId = req.user.id;
  
  Answer.findById(answerId)
    .then((answer) => {
      // restricting the author for voting his own questions/answers
      if (answer.author.toString() === userId) {
        return res.status(403).send('You cannot vote for your own answer.');
      }
      return Answer.findByIdAndUpdate(answerId, {
        $addToSet: { upvotes: userId },
        $pull: { downvotes: userId },
      });
    })
    .then((answer) => {
      if (answer.downvotes.includes(userId)) {
        answer.downvotes.pull(userId);
        answer.save();
      }
      res.redirect('/questions/' + answer.questionId);
    })
    .catch((error) => {
      console.log(error);
    });
});

// downvotes fetching
router.post('/:id/downvoteanswer', (req, res, next) => {
  let answerId = req.params.id;
  let userId = req.user.id;
  //   req.body.authorId = req.user.id;
  Answer.findById(answerId)
    .then((answer) => {
       // restricting the author for voting his own questions/answers
      if (answer.author.toString() === userId) {
        return res.status(403).send('You cannot vote for your own answer.');
      }
      return Answer.findByIdAndUpdate(answerId, {
        $addToSet: { downvotes: userId },
        $pull: { upvotes: userId },
      });
    })
    .then((answer) => {
      if (answer.upvotes.includes(userId)) {
        answer.upvotes.pull(userId);
        answer.save();
      }
      res.redirect('/questions/' + answer.questionId);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
