const
    mongoose = require("mongoose"),
    optionsSchema = mongoose.Schema({
        a: {type: String, required: [true, "option a not provided"]},
        b: {type: String, required: [true, "option b not provided"]},
        c: {type: String, required: [true, "option c not provided"]},
        d: {type: String, required: [true, "option d not provided"]}
    }),
    questionSchema = mongoose.Schema({
        imagePath: {type: String},
        content: {
            type: String,
            required: [true, "content not provided"]
        },
        options: {
            type: optionsSchema,
            required: [true, "options not provided"]
        },
        answer: {
            type: String, enum: ["a","b","c","d"], required: [true, "answer not provided"]
        },
        stage: {
            type: Number, max: 3, min: 1, required: [true, "stage not provided"]
        },
        hint: {
            type: String, required: [true, "hint not provided"]
        },
        created: {
            type: Date, default: Date.now
        }
    }),
    questionFields = function makeFields(){
        return {
            content: undefined,
            answer: undefined,
            imagePath: undefined,
            options: {
                a: undefined,
                b: undefined,
                c: undefined,
                d: undefined
            }
        }
    },
    questionModel = mongoose.model("question", questionSchema)
;
questionModel.Fields = questionFields;
module.exports = questionModel;