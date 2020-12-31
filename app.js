'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const debug = require('debug')('egg-passport-github');
const assert = require('assert');
const Strategy = require('passport-github').Strategy;


//  login: 'dev800',
//  id: 6532780,
//  node_id: 'MDQ6VXNlcjY1MzI3ODA=',
//  avatar_url: 'https://avatars3.githubusercontent.com/u/6532780?v=4',
//  gravatar_id: '',
//  url: 'https://api.github.com/users/dev800',
//  html_url: 'https://github.com/dev800',
//  followers_url: 'https://api.github.com/users/dev800/followers',
//  following_url: 'https://api.github.com/users/dev800/following{/other_user}',
//  gists_url: 'https://api.github.com/users/dev800/gists{/gist_id}',
//  starred_url: 'https://api.github.com/users/dev800/starred{/owner}{/repo}',
//  subscriptions_url: 'https://api.github.com/users/dev800/subscriptions',
//  organizations_url: 'https://api.github.com/users/dev800/orgs',
//  repos_url: 'https://api.github.com/users/dev800/repos',
//  events_url: 'https://api.github.com/users/dev800/events{/privacy}',
//  received_events_url: 'https://api.github.com/users/dev800/received_events',
//  type: 'User',
//  site_admin: false,
//  name: null,
//  company: null,
//  blog: '',
//  location: null,
//  email: null,
//  hireable: null,
//  bio: null,
//  twitter_username: null,
//  public_repos: 101,
//  public_gists: 0,
//  followers: 0,
//  following: 0,
//  created_at: '2014-01-29T08:14:52Z',
//  updated_at: '2020-12-30T06:59:44Z'

function mountOneClient (config, app, client = "github") {
  config.passReqToCallback = true;
  assert(config.key, '[egg-passport-github] config.passportGithub.key required');
  assert(config.secret, '[egg-passport-github] config.passportGithub.secret required');
  config.clientID = config.key;
  config.clientSecret = config.secret;

  config.providerPlatform = config.providerPlatform || 'github';
  config.providerMedia = config.providerMedia || 'github';

  // must require `req` params
  app.passport.use(client, new Strategy(config, (req, accessToken, refreshToken, params, profile, done) => {
    // format user
    const user = {
      providerPlatform: config.providerPlatform,
      providerMedia: config.providerMedia,
      provider: client,
      id: profile.id,
      name: profile.username,
      displayName: profile.displayName,
      photo: profile.photos && profile.photos[0] && profile.photos[0].value,
      accessToken,
      refreshToken,
      params,
      profile,
    };

    debug('%s %s get user: %j', req.method, req.url, user);

    // let passport do verify and call verify hook
    app.passport.doVerify(req, user, done);
  }));
};

exports.default = (app) => {
  const config = app.config.passportGithub;

  if (config.clients) {
    for (const client in config.clients) {
      const c = config.clients[client];

      if (config.state) {
        c.state = config.state
      }

      if (config.client) {
        c.client = config.client
      }

      mountOneClient(c, app, client);
    }
  } else {
    mountOneClient(config, app);
  }
};
