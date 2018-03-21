const mongoose = require('mongoose');

const connect = process.env.MONGODB_URI;
mongoose.connect(connect);
const Schema = mongoose.Schema;

/* Each user has a username, password, list of documents they own (create) and a
list of documents they have contributed to */
const userSchema = new Schema({
  username: String,
  password: String,
  // Array of document references for docs that the user owns:
  ownedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
  // Array of document references for docs that the user has access to:
  contributedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
});
const User = mongoose.model('User', userSchema);

/* Each document has a title, content, an owner, and a list of
contributors (which doesn't include the owner) */
const documentSchema = new Schema({
  content: mongoose.Schema.Types.ObjectId, // this will reference the state
  // url: String,
  title: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  previousVersions: [mongoose.Schema.Types.ObjectId],
});
const Document = mongoose.model('Document', documentSchema);

const contentSchema = new Schema({
  content: Object,
});
const Content = mongoose.model('Content', contentSchema);

module.exports = {
  User,
  Document,
  Content,
};
