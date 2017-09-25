const Post = require('../models/Post');

/**
 * GET /posts
 * Posts list page.
 */
exports.getPosts = (req, res) => {

  Post.find({ active:true }, (err, allPosts) => {
    if (err) { return next(err); }
    if (!allPosts) {
      req.flash('errors', { msg: 'Found no posts.' });
      return res.redirect('/');
    }
    res.render('blog/posts', {
      title: 'Range Coworking Blog',
      allPosts
    });
  });

};

/**
 * GET /posts/:slug
 * Post  page.
 */
exports.getPost = (req, res) => {
  const postslug = req.params.slug;
  //req.flash('errors', { msg: 'Could not find that location.'+locationid });

  Post.findOne({ slug:postslug, active:true }, (err, post) => {
    if (err) { return next(err); }
    if (!post) {
      req.flash('errors', { msg: 'Create new post.' });
      //return res.redirect('/blog');
      post={};
    }
   //req.flash('errors', { msg: 'Location.'+location });

    res.render('blog/post', {
      title: 'Range Coworking Blog',
      post
    });
  });

};

/**
 * POST /posts/:id
 * Update or create new blog post.
 */
exports.editPost = (req, res, next) => {
  //delete record?
  if (req.body.action=='delete'){    
    Post.remove({ _id: req.body.id }, (err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: 'Post '+req.body.id+' has been deleted.' });
      return res.redirect('/blog');
    });
  } else {
   
  //update if existing post
  if (req.body.id) { 
    Post.findById(req.body.id, (err, post) => {
      if (err) { return next(err); }
      post.title = req.body.title || ''; 
      post.slug = req.body.slug || ''; 
      post.description = req.body.description || ''; 
      post.text = req.body.text || ''; 
      post.tags = req.body.tags || ''; 
      post.active = req.body.active || ''; 
   
      post.save((err) => {
        if (err) {
          if (err.code === 11000) {
            req.flash('errors', { msg: 'The slug you have entered is already associated with a post.' });
            //return res.redirect('/blog');
          }
          return next(err);
        }
        req.flash('success', { msg: 'Blog post has been updated.' });
        res.redirect('/blog');
      });
    });
  } else {
    
    //saving new record
    var post = new Post({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      text: req.body.text,
      tags: req.body.tags,
      author: req.body.author,
      active: req.body.active

    });
    
    post.save((err) => {
    if (err) {
      if (err.code === 11000) {
        req.flash('errors', { msg: 'The slug you have entered is already associated with a post.' });
        //return res.redirect('/locations/account');
      }
      return next(err);
    }
      req.flash('success', { msg: 'Post has been saved.' });
      res.redirect('/blog');
    });
 } //end if/else
  } //end delete if/else
};

/**
 * GET /blog/new
 * Enter new post  page.
 */
exports.createNewPost = (req, res) => {
    post={};
    res.render('blog/edit', {
      title: 'New Blog Post',
      post
    });
};

/**
 * GET /blog/:id
 * Get  post  to edit.
 */
exports.getPostToEdit = (req, res, next) => {
  //req.flash('errors', { msg: 'Could not find that location.'+locationid });
 
  Post.findById(req.params.id, (err, post) => {
    if (err) { return next(err); }
    if (!post) {
      req.flash('errors', { msg: 'Could not find post.' });
      return res.redirect('/blog');
    }

    res.render('blog/edit', {
      title: 'Edit Blog Post',
      post
    });
  });
};


/**
 * POST /blog/:id/delete
 * Delete post
 */
exports.postDeletePost = (req, res, next) => {
  Post.remove({ _id: req.params.id }, (err) => {
    if (err) { return next(err); }
    req.flash('info', { msg: 'Post '+req.params.id+' has been deleted.' });
    res.redirect('/blog');
  });
};
