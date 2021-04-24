const express = require('express');
const router = express.Router();
const ArticleSchema = require('../db/models/article-schema');
const helpers = require('../helpers/user-validation');
const ArticleService = require('../services/article.service')(ArticleSchema);


// @ts-check
// Add a new Article
router.post('/add', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
    let {
        ...article
    } = req.body;
    try {
        let response = await ArticleService.addArticle(article);
        res.json(response);
    } catch (error) {
        next(error);
    }


});


// get all articles
router.get('/', helpers.validateUser, helpers.isGranted, helpers.isAdmin, async function (req, res, next) {
    try {
        let response = await ArticleService.getAllArticles();
        if (response) {
            res.json(response)
        }
    } catch (error) {
        next(error)
    }
});

// get article by ID 
router.get('/:id', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
  let articleId=req.params.id;
  try {
      let response = await ArticleService.getArticleById(articleId);
      if (response) {
          res.json(response)
      }
  } catch (error) {
      next(error)
  }
});

// Get Article By Owner
router.get('/author/:userId', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
    let author = req.params.userId;
    try {
        let response = await ArticleService.getArticlesByAuthor(author);
        if (response) {
            res.json(response)
        }
    } catch (error) {
        next(error)
    }
});


// Update a given article
router.put('/update/:id', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
    let articleId = req.params.id;
    let article = {
      ...req.body
    };
  
    try {
      let response = await ArticleService.updateArticle(articleId,article);
      if (response) {
        res.json(response);
      }
    } catch (error) {
      next(error);
    }
  });


  // remove a article
router.delete('/delete/:id', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
    let articleId = req.params.id;
  
    try {
      let response = await ArticleService.removeArticle(articleId);
      if (response) {
        res.json(response);
      }
    } catch (error) {
      next(error);
    }
  });

  // Set Featured Article a given User
router.put('/featured/:userId/:articleId', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
  let userId=req.params.userId;
  let articleId = req.params.articleId;
  try {
    let response = await ArticleService.setFaturedArticle(userId,articleId);
    if (response) {
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});

// get Featured Article by userId 
router.get('/featured/:userId', async function (req, res, next) {
  let userId=req.params.userId;
  try {
      let response = await ArticleService.getFearuredArticle(userId);
      if (response) {
          res.json(response)
      }
  } catch (error) {
      next(error)
  }
});

  

module.exports = router;