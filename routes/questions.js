const
    async = require("async"),
    fs = require("fs"),
    multer = require("multer"),
    mongoose = require("mongoose"),
    router = require("express").Router(),
    appUtils = require("../lib/utils"),
    auth = require("../lib/auth"),
    {Question} = require("../lib/db")
;

module.exports = router;
router
    .get("/", getQuestions)
    .post("/", auth.bounceNonAdmin, postQuestions)
;

function getQuestions(req, res, next){
    let limit = Number(req.query.limit) || 20,
        skip =  Number(req.query.from) || 0
    ;
    Question.find({}, "content answer options", {limit, skip}, function sendQuestions(err, questions){
        if(err) return next(appUtils.ServerError(err));
        if(!questions.length) return res._sendError("No matching documents", appUtils.ErrorReport(404, {questions: "no questions found found"}));
        return res._success(questions)
    })
};

function postQuestions(req,res,next){
    if(req.file){
        let questionfields = Question.Fields(),
            question = JSON.parse(req.body.question)
        ;
       with(questionfields){
            ({content, answer, imagePath}) = question; 
            if(question.options){
                with(options){                                            //of questionfields
                    [a, b, c, d] = [question.options.a, question.options.b, question.options.c, question.options.d];
                }
            }
        }
        Question.create(questionfields, function reportOutcome(err, question){
            if(err){
                fs.unlink(req.file.path, function afterImageDelete(err){
                    if(err) next(appUtils.ServerError(500, "none", err));
                    let errorDetails = {};
                    if(err instanceof mongoose.Error.ValidationError){
                        for(errorName in err.errors){
                            errorDetails[errorName] = err.errors[errorName].message;
                        }
                        return res._sendError(`invalid and/or missing parameters`, appUtils.ErrorReport(errorDetails))
                    };
                    return next(appUtils.ServerError(500, err))
                })
            }
                return res._success({_id: question._id})
        })
    }else{
        let postQuestions = [],
        receivedQuestions = req.body.questions
        ;
        while(receivedQuestions.length){
            let questionfields = Question.Fields(),
                question = receivedQuestions.shift();
            ;
            with(questionfields){
                [content, answer] = [question.content, question.answer];
                if(question.options){
                    with(options){                                            //of questionfields
                        [a, b, c, d] = [question.options.a, question.options.b, question.options.c, question.options.d];
                    }
                }
            }
            postQuestions.push(async.reflect(function saveUser(cb){
                new Question(questionfields).save(cb)                         //return a function that saves the question
            }))
        }
        async.parallel(postQuestions, reporter(res, next))
    }
};

function reporter(res, next){
    return function reportOutcomes(_err, results){
        results = results.map(function makeReport(result){
            let err;
            if(err = result.error){
                let errorDetails = {};
                if(err instanceof mongoose.Error.ValidationError){
                    for(errorName in err.errors){
                        errorDetails[errorName] = err.errors[errorName].message;
                    }
                    return {
                        status: "failed",
                        reason: `invalid and/or missing parameters`,
                        errors: appUtils.ErrorReport(errorDetails)
                    }
                };
                next(appUtils.ServerError(500, "none", err));
                return {
                    status: "failed",
                    reason: `internal server error`,
                    errors: appUtils.ErrorReport(500, {server: "internal server error"})
                }
            }else{
                return {
                    status: "success",
                    result: {
                        statusCode: 200,
                        _id: result.value._id
                    }
                }
            }
        });
        return res._success({statusCode:207, results})
    }
}
