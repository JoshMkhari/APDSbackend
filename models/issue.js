const mongoose = require('mongoose')

const issueSchema = mongoose.Schema(
    {
        id: {type: String, required: true},
        name: {type:String, required: true}
    }
)

module.exports = mongoose.model('Issue',issueSchema)