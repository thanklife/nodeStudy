var env = process.env.NODE_ENV || 'development';
env = env.toLowerCase();

if (env == "production") {
    module.exports = require('./production.js');
}
else {
    module.exports = require('./development.js');
}