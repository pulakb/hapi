'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const _ = require('lodash-node');

exports.register = function(server, options, next) {

  const db = server.app.db;
  const users = db.collection('users');

  server.route({
    method: 'GET',
    path: '/users',
    handler: function(request, reply) {

      users.find((err, docs) => {

        if (err) {
          return reply(Boom.badData('Internal MongoDB error', err));
        }

        reply(docs);
      });

    }
  });

  server.route({
    method: 'GET',
    path: '/users/{id}',
    handler: function(request, reply) {

      users.findOne({
        UserID: request.params.id
      }, (err, doc) => {

        if (err) {
          return reply(Boom.badData('Internal MongoDB error', err));
        }

        if (!doc) {
          return reply(Boom.notFound());
        }

        reply(doc);
      });

    }
  });

  server.route({
    method: 'POST',
    path: '/users',
    handler: function(request, reply) {

      const book = request.payload;

      //Create an id
      book._id = uuid.v1();

      users.save(book, (err, result) => {

        if (err) {
          return reply(Boom.badData('Internal MongoDB error', err));
        }

        reply(book);
      });
    },
    config: {
      validate: {
        payload: {
          title: Joi.string().min(10).max(50).required(),
          author: Joi.string().min(10).max(50).required(),
          isbn: Joi.number()
        }
      }
    }
  });

  server.route({
    method: 'PATCH',
    path: '/users/{id}',
    handler: function(request, reply) {

      users.update({
        _id: request.params.id
      }, {
        $set: request.payload
      }, function(err, result) {

        if (err) {
          return reply(Boom.badData('Internal MongoDB error', err));
        }

        if (result.n === 0) {
          return reply(Boom.notFound());
        }

        reply().code(204);
      });
    },
    config: {
      validate: {
        payload: Joi.object({
          title: Joi.string().min(10).max(50).optional(),
          author: Joi.string().min(10).max(50).optional(),
          isbn: Joi.number().optional()
        }).required().min(1)
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/users/{id}',
    handler: function(request, reply) {

      users.remove({
        _id: request.params.id
      }, function(err, result) {

        if (err) {
          return reply(Boom.badData('Internal MongoDB error', err));
        }

        if (result.n === 0) {
          return reply(Boom.notFound());
        }

        reply().code(204);
      });
    }
  });

// All Friends - Route

server.route({
  method: 'GET',
  path: '/users/{id}/friends',
  handler: function(request, reply) {

    users.findOne({
      UserID: request.params.id
    }, (err, doc) => {

      if (err) {
      return reply(Boom.badData('Internal MongoDB error', err));
    }

    if (!doc) {
      return reply(Boom.notFound());
    }

    reply(doc.friends);
  });

}
});

// Specific Friend - Route

server.route({
  method: 'GET',
  path: '/users/{id}/friends/{fid}',
  handler: function(request, reply) {

    users.findOne({
      UserID: request.params.id
    }, (err, doc) => {

      if (err) {
      return reply(Boom.badData('Internal MongoDB error', err));
    }

    if (!doc) {
      return reply(Boom.notFound());
    }

    let _fid = request.params['fid'];
    let _friends = doc.friends;
    let _friend;

    _friends.forEach(function (friend) {
      if (friend.UserId === _fid) {
        _friend = friend;
      }
    });

    reply(_friend);

  });

}
});

// All Wallposts - Route

server.route({
  method: 'GET',
  path: '/users/{id}/wallposts',
  handler: function(request, reply) {

    users.findOne({
      UserID: request.params.id
    }, (err, doc) => {

      if (err) {
      return reply(Boom.badData('Internal MongoDB error', err));
    }

    if (!doc) {
      return reply(Boom.notFound());
    }

    reply(doc.WallPosts);
  });

}
});

// Specific Wallposts - Route

server.route({
  method: 'GET',
  path: '/users/{id}/wallposts/{postid}',
  handler: function(request, reply) {

    users.findOne({
      UserID: request.params.id
    }, (err, doc) => {

      if (err) {
      return reply(Boom.badData('Internal MongoDB error', err));
    }

    if (!doc) {
      return reply(Boom.notFound());
    }

    let _postid = request.params['postid'];
    let _wallposts = doc.WallPosts;
    let _wallpost;

    _wallposts.forEach(function (post) {
      if (post.postId === _postid) {
        _wallpost = post;
      }
    });

    reply(_wallpost);
  });

}
});

// Comments of Wallposts - Route

server.route({
  method: 'GET',
  path: '/users/{id}/wallposts/{postid}/comments',
  handler: function(request, reply) {

    users.findOne({
      UserID: request.params.id
    }, (err, doc) => {

      if (err) {
      return reply(Boom.badData('Internal MongoDB error', err));
    }

    if (!doc) {
      return reply(Boom.notFound());
    }

    let _postid = request.params['postid'];
    let _wallposts = doc.WallPosts;
    let _wallpost;

    _wallposts.forEach(function (post) {
      if (post.postId === _postid) {
        _wallpost = post;
      }
    });

    let _comments = _wallpost["Comments"];

    reply(_comments);
  });

}
});

  return next();
};

exports.register.attributes = {
  name: 'routes-users'
};
