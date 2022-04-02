const util = require('util')
const OAuth2Strategy = require('passport-oauth2')
const request = require('request')

let clientID

function Strategy(options, verify) {
  options = options || {}
  options.authorizationURL = options.authorizationURL || 'https://id.twitch.tv/oauth2/authorize'
  options.tokenURL = options.tokenURL || 'https://id.twitch.tv/oauth2/token'
  clientID = options.clientID

  OAuth2Strategy.call(this, options, verify)
  this.name = 'twitch'

  this._oauth2.setAuthMethod('Bearer')
  this._oauth2.useAuthorizationHeaderforGET(true)
}

util.inherits(Strategy, OAuth2Strategy)

Strategy.prototype.userProfile = function (accessToken, done) {
  const options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': clientID,
      Accept: 'application/vnd.twitchtv.v5+json',
      Authorization: `Bearer ${accessToken}`
    }
  }

  request(options, (error, response, body) => {
    if (response && response.statusCode === 200) {
      const json = JSON.parse(body)
      const profile = { provider: 'twitch' }

      profile.id = json.data[0].id
      profile.userName = json.data[0].login
      profile.displayName = json.data[0].display_name
      profile.profileImageUrl = json.data[0].profile_image_url
      profile.viewCount = json.data[0].view_count

      profile._raw = body
      profile._json = json
      done(null, profile)
    } else {
      done(JSON.parse(body))
    }
  })
}

Strategy.prototype.authorizationParams = function (options) {
  const params = {}
  if (typeof options.forceVerify !== 'undefined') {
    params.force_verify = !!options.forceVerify
  }
  return params
}

module.exports = Strategy
