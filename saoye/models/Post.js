var keystone = require('keystone');
var Types = keystone.Field.Types;
var TypesUtils = require('../commons/types-utils.js');

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
});

// Use extra functions in commons/types-utils.js
var titleImageObj = TypesUtils.createFileTypeObj('post/images/');
var postImageObj = TypesUtils.createFileTypeObj('post/images/');

Post.add({
    title: { type: String, required: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    uploader: { type: Types.Relationship, ref: 'User', index: true },
    publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	titleImage: titleImageObj,
    postImage: postImageObj, 
	contentImage: { type: Types.LocalFiles, dest: process.cwd() + '/files/post/images/'},
	
    content: {
        brief: { type: Types.Html, wysiwyg: true, height: 150 },
        extended: { type: Types.Html, wysiwyg: true, height: 400 }
    },
    categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	authors: { type: Types.Relationship, ref: 'Author', many: true },
	isPromoted: { type: Types.Boolean } //Article will be posted on homepage if true
});

Post.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
