const steem = require('steem');
var utils = require('./utils');

var config = null;
var query = null;

steem.api.setOptions({ url: 'https://api.steemit.com' });

// Load the settings from the config file
config = utils.loadConfig();

startProcess();
// Schedule to run every x minutes
setInterval(startProcess, config.posting_interval * 60 * 1000);

function startProcess() {
    // Load the settings from the config file each time so we can pick up any changes
    config = utils.loadConfig();
    query = {
        limit: 10
    };
    steem.api.getDiscussionsByCreated(query, function(err, result) {
        if (err) {
            utils.error(err);
        } else {
            result.forEach(content => {
                checkRepuration(content);    
            });
        }
    });
}

function checkRepuration(content) {
    if (content.author_reputation <= config.author_max_reputation) {
        countFollowers(content.author);
    } else {
        utils.error("@" + content.author + " has higher reputation.");
    }
}

function countFollowers(author) {
    steem.api.getFollowCount(author, function(err, result) {
        if (result.following_count < config.author_min_following) {
                utils.error("@" + author + " is following " + result.following_count + " users.");
        } else if (result.follower_count > config.author_max_followers) {
            utils.error("@" + author + " has " + result.follower_count + " followers.");
        } else {
            followUser(author);
        }
    });
}

function followUser(author) {
    let followReq = ["follow"];
    followReq.push({follower: config.account, following: author, what: ["blog"]});
    
    const customJson = JSON.stringify(followReq);

    steem.broadcast.customJson(config.posting_key, [], [config.account], "follow", customJson, function(err, result) {
        utils.log(err, "Following: @" + author);
    });
}