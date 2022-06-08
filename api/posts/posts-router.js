// implement your posts router here
const express = require('express');
const router = express.Router();
const Post = require('./posts-model.js');

//router for getting a post
router.get('/', (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'The post information could not be retrieved' });
    });
});

//router for getting a post using the ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'the post information could not ber retrieved' });
    });
});

//router for posting
router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res
        .status(400)
        .json({ message: 'Please provide title and contents for the post' });
    } else {
      const post = await Post.insert({ title, contents });
      const { id } = post;
      //pulling the ID from the previously pulled post
      Post.findById(id)
        .then((post) => {
          res.status(201).json(post);
        })
        .catch(() => {
          res
            .status(500)
            .json({ message: 'the post information could not be retrieved' });
        });
    }
  } catch (error) {
    res.status(500).json({
      message: 'There was an error while saving the post to the database',
    });
  }
});

// import for updating a specified ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, contents } = req.body;
    if (!title || !contents) {
      res
        .status(400)
        .json({ message: 'Please provide title and contents for the post' });
    } else {
      const updatedPost = await Post.update(id, { title, contents });
      if (!updatedPost) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      } else {
        Post.findById(id)
          .then((post) => {
            res.status(200).json(post);
          })
          .catch(() => {
            res
              .status(500)
              .json({ message: 'the post information could not be retrieved' });
          });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'The post information could not be modified' });
  }
});

//Delete at the endpoint
router.delete('/:id', async (req, res) => {
  const deletedPost = await Post.findById(req.params.id);
  const { id } = req.params;
  Post.remove(id)
    .then((deleted) => {
      if (!deleted) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      } else {
        res.json(deletedPost);
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The post could not be removed' });
    });
});

//get comments at endpoint
router.get('/:id/comments', (req, res) => {
  Post.findPostComments(req.params.id).then((comments) => {
    if (comments.length > 0) {
      res.status(200).json(comments);
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist' });
    }
  });
});

module.exports = router;