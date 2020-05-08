/**
 * Created by sanshi on 3/22/20.
 */
function echo() {
  console.log.apply(console, arguments)
}

var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/forTest', (err, client) => {
    if(err){
        echo('failed...')
    }else{
        echo('succeed...')
    }
})

var ArticleSchema = new Schema({
    title: {type: String, required:true},
    createdAt: {type: Date, default: Date.now},
    description: {type: String, required: true},
    tags: [String],
    comments: [
        {
            post: String,
            posted: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

const Article = mongoose.model('Article', ArticleSchema)
var article = new Article({
    "title" : "A test Article",
    "description" : "test article description",
    "tags" : [
        "test tag"
    ],
    "createdAt" : "2015-03-08T20:39:37.980Z"
})

// article.save().then(result => {
//     console.log(result)
// })

Article.findByIdAndUpdate()






