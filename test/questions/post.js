const
    request = require("request"),
    util = require("util"),
    tap = require("tap"),
    adminCredentials = {username: "Dika", password: "12afrivelle345.."},
    emptyQuestion = {},
    questionUrl = "http://localhost:8000/questions",
    emptyArgsQuestion = { content: undefined, answer: undefined, options: { a: undefined, b: undefined, c: undefined, d: undefined } },
    incompleteQuestion = { content: undefined, options: { a: undefined, b: undefined, c: undefined} },
    partialArgsQuestion = { content: undefined, answer: "c", options: { a: "Jonah", b: undefined, c: "Jesus", d: undefined } },
    completeQuestion = { content: "Who is the son of God", answer: "c", options: { a: "jonah", b: "Ifeanyi", c: "Jesus", d: "Dika" } },
    allQuestions = [emptyQuestion, incompleteQuestion, emptyArgsQuestion, partialArgsQuestion, completeQuestion]
;

//remove later
var authToken = 0;

tap.test("posting questions to quiz api", {buffered: true}, function(t){
    testQuestions(t)
})
function testQuestions(t){
    request({method: "POST", url: questionUrl, headers: {Authorization: `Bearer ${authToken}`}, json: {questions: allQuestions}, encoding: "utf-8"}, function testResults(err, response, body){
        //console.log(util.inspect({body},{depth: null, color: true}))
        if(err) return  console.log("request failed. error: ", err)
        if(Math.floor(response.statusCode/100) === 5) return console.log("Request failed due to internal server error. Response: ", body);
        let [emptyQuestionRes, incompleteQuestionRes, emptyArgsQuestionRes, partialArgsQuestionRes, completeQuestionRes] = body.result.results;
        t.test("posting empty question fails with 400, indicating no content, answer and options were provided", function testEmptyQuestion(t){
            with(emptyQuestionRes){
                t.equal(status, "failed");
                t.equal(reason, `invalid and/or missing parameters`);
                with(errors){
                    t.equal(statusCode, 400);
                    with(errorDetails){
                        t.equal(content, "content not provided");
                        t.ok(options, "options should error");
                        t.equal(answer, "answer not provided");
                        t.equal(errorDetails["options.a"], "option a not provided");
                        t.equal(errorDetails["options.b"], "option b not provided");
                        t.equal(errorDetails["options.c"], "option c not provided");
                        t.equal(errorDetails["options.d"], "option d not provided");
                        t.end()
                    }
                }
            }
        })

        t.test("posting incomplete question(undefined parameters) fails with 400, indicating no content, answer and options were provided", function testIncompleteQuestion(t){
            with(incompleteQuestionRes){
                t.equal(status, "failed");
                t.equal(reason, `invalid and/or missing parameters`);
                with(errors){
                    t.equal(statusCode, 400);
                    with(errorDetails){
                        t.equal(content, "content not provided");
                        t.ok(options, "options should error");
                        t.equal(answer, "answer not provided");
                        t.equal(errorDetails["options.a"], "option a not provided");
                        t.equal(errorDetails["options.b"], "option b not provided");
                        t.equal(errorDetails["options.c"], "option c not provided");
                        t.equal(errorDetails["options.d"], "option d not provided");
                        t.end()
                    }
                }
            }
        })

        t.test("posting question with undefined and null arguuments should fail with 400, indicating no content, answer and individual options were provided", function testNullArgsQuestion(t){
            with(emptyArgsQuestionRes){
                t.equal(status, "failed");
                t.equal(reason, `invalid and/or missing parameters`);
                with(errors){
                    t.equal(statusCode, 400);
                    with(errorDetails){
                        t.equal(content, "content not provided");
                        t.ok(options, "options should error");
                        t.equal(answer, "answer not provided");
                        t.equal(errorDetails["options.a"], "option a not provided");
                        t.equal(errorDetails["options.b"], "option b not provided");
                        t.equal(errorDetails["options.c"], "option c not provided");
                        t.equal(errorDetails["options.d"], "option d not provided");
                        t.end()
                    }
                }
            }
        })

        t.test("posting question with some valid and undefined/null arguuments should fail with 400, indicating some properties were provided but others were not", function testNullArgsQuestion(t){
            with(partialArgsQuestionRes){
                t.equal(status, "failed");
                t.equal(reason, `invalid and/or missing parameters`);
                with(errors){
                    t.equal(statusCode, 400);
                    with(errorDetails){
                        t.equal(content, "content not provided");
                        t.ok(options, "options should error");
                        t.notOk(errorDetails["options.a"], "option a should not error");
                        t.equal(errorDetails["options.b"], "option b not provided");
                        t.notOk(errorDetails["options.c"], "option c should not error");
                        t.equal(errorDetails["options.d"], "option d not provided");
                        t.end()
                    }
                }
            }
        })

        t.test( "posting question with all and correct arguuments should succeed with 200, returning the id of the question", function testCorrectQuestionRes(t){
            t.equal(completeQuestionRes.status, "success");
            with(completeQuestionRes.result){
                t.equal(statusCode, 200);
                t.ok(_id, "question id should be valid");
                t.end()
            }
        })

        t.equal(completeQuestionRes.status, "success", "question with all and correct arguuments should succeed with 200, returning the id of the question")
        
        t.end()
    })
}
