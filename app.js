'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const debug = require('debug')('egg-passport-github');
const assert = require('assert');
const Strategy = require('passport-github').Strategy;

function mountOneClient (config, app, client = "github") {
  config.passReqToCallback = true;
  assert(config.key, '[egg-passport-github] config.passportGithub.key required');
  assert(config.secret, '[egg-passport-github] config.passportGithub.secret required');
  config.clientID = config.key;
  config.clientSecret = config.secret;

  // must require `req` params
  app.passport.use(client, new Strategy(config, (req, accessToken, refreshToken, params, profile, done) => {
    // format user
    const user = {
      providerPlatform: 'github',
      providerGroup: 'github',
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
      mountOneClient(c, app, client);
    }
  } else {
    mountOneClient(config, app);
  }
};
