// Server Code is totally separated from Test Code on jest
// Thus, need to run MongoDB Connection to use DB directly
jest.setTimeout(10000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

// mongoose does not want to use built in promise
// tell mongoose to use promise of global object
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
