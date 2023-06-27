var express = require('express');
var router = express.Router();
var Question = require('../models/question');
var Answer = require('../models/answer');
var Comment = require('../models/comment');
var auth = require('../middlewares/auth');

router.get('/', (req, res, next) => {
  Question.find({})
    .then((questions) => {
      // console.log(questions);
      res.render('questions', { questions });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.use(auth.isUserLoggedIn);//middleware for the user to be logged in to access below operations

router.get('/new', (req, res, next) => {
  res.render('askQuestions');
});

router.post('/', (req, res, next) => {
  let userId = req.user.id;
  req.body.author = userId; //user who asks the question as the author of question
  req.body.tags = req.body.tags.trim().split(','); // for splitiing tags separate
  Question.create(req.body)
    .then(() => {
      res.redirect('/questions');
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;

  Question.findById(id)
    .populate('answers')
    .populate('comments')
    .then((question) => {
      res.render('questionDetails', { question });
    });
});

// upvotes fetching
router.post('/:id/upvote', (req, res, next) => {
  let id = req.params.id;
  let userId = req.user.id;

  Question.findById(id)
    .then((question) => {
      if (question.author.toString() === userId) {
        // Handle the case where the user is trying to vote for their own answer
        return res.status(403).send('You cannot vote for your own answer.');
      }
      return Question.findByIdAndUpdate(id, {
        $addToSet: { upvotes: userId },
        $pull: { downvotes: userId },
      });
    })
    .then((question) => {
      // checking the user already upvoted the answer or not
      if (question.downvotes.includes(userId)) {
        question.downvotes.pull(userId);//here if user is downvoted already now he is upvoting
        question.save();
      }
      res.redirect('/questions/' + id);
    })
    .catch((error) => {
      console.log(error);
    });
});

// downvotes fetching
router.post('/:id/downvote', (req, res, next) => {
  let id = req.params.id;
  let userId = req.user.id;

  Question.findById(id)
    .then((question) => {
      if (question.author.toString() === userId) {
        return res.status(403).send('You cannot vote for your own answer.');
      }
      return Question.findByIdAndUpdate(id, {
        $addToSet: { downvotes: userId },
        $pull: { upvotes: userId },
      });
    })
    .then((question) => {
      // checking the user  already upvoted the question or not
      if (question.upvotes.includes(userId)) {
        question.upvotes.pull(userId);//here if user is upvoted already now he is downvoting
        question.save();
      }
      res.redirect('/questions/' + id);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/:id/answers', (req, res, next) => {
  var id = req.params.id;
  req.body.questionId = id;
  req.body.author = req.user.id; //user who answers as author for answer 

  Answer.create(req.body)
    .then((answer) => {
      Question.findByIdAndUpdate(id, { $push: { answers: answer._id } }).then(
        () => {
          res.redirect('/questions/' + id);
        }
      );
    })
    .catch((err) => {
      if (err) return next(err);
    });
});

router.post('/:id/comments', (req, res, next) => {
  var id = req.params.id;
  let userId = req.user.id;
  req.body.user = userId;

  Comment.create(req.body)
    .then((comment) => {
      Question.findByIdAndUpdate(id, { $push: { comments: comment._id } }).then(
        () => {
          res.redirect('/questions/' + id);
        }
      );
    })
    .catch((err) => {
      if (err) return next(err);
    });
});



module.exports = router;
