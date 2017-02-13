'use strict';

var roll = require('./roll');

var errCount = 0;
var results = [];

var checkArraysEqual = (one, two) => (
    one.length === two.length &&
        one.every((v,i) => (v === two[i]))
);

roll([
    (cb) => {
        /*
            Happy flow
         */

        var firstFunction = (callback) => {
            console.log('√ First function successfully called');
            results.push('firstFunction');
            callback(null, 'firstArg');
        };

        var secondFunction = (arg1, callback) => {
            console.log('√ Second function successfully called');
            results.push('secondFunction');

            if (arg1 === 'firstArg') {
                console.log('√ Arg1 correctly passed on');
            } else {
                console.log("ERR!! arg1 in secondFunction doesn't equal 'firstArg'");
                errCount++;
            }

            callback(null, ['secondArg'], {arg3: 'thirdArg'});
        };

        var thirdFunction = (arg2, arg3, callback) => {
            console.log('√ Third function successfully called');
            results.push('thirdFunction');

            if (arg2.constructor === Array &&
                arg2[0] === 'secondArg' &&
                arg2[1] === undefined) {
                console.log('√ Arg2 correctly passed on');
            } else {
                console.log("ERR!! arg2 in thirdFunction doesn't equal ['firstArg']");
                errCount++;
            }

            if (arg3 && typeof arg3 === 'object' && arg3.arg3 === 'thirdArg') {
                console.log('√ Arg3 correctly passed on');
            } else {
                console.log("ERR!! arg3 in thirdFunction doesn't equal {arg3: 'thirdArg'}");
                errCount++;
            }

            callback(null, 'done');
        };

        console.log('\n••• Testing the happy flow...');

        roll([
            firstFunction,
            secondFunction,
            thirdFunction,
        ], (err, lastArg) => {
            console.log('√ happyFlowCallback successfully called');
            results.push('happyFlowCallback');

            if (err === null) {
                console.log('√ Err correctly set in happyFlowCallback');
            } else {
                console.log("ERR!! err in happyFlowCallback doesn't equal null");
                errCount++;
            }

            if (lastArg === 'done') {
                console.log('√ lastArg correctly passed to callback');
            } else {
                console.log("ERR!! lastArg in the callback doesn't equal 'done'");
                errCount++;
            }

            cb();
        });
    }, (cb) => {
        /*
            Breaking flow
         */


        var breakingFunction = (callback) => {
            console.log('√ breakingFunction successfully called');
            results.push('breakingFunction');
            // Whoops, something goes wrong...
            callback('Error', 'result');
        };

        var ghostFunction = (callback) => {
            console.log("ERR!! ghostFunction shouldn't have been called.");
            results.push('ghostFunction');
            errCount++;
            callback();
        };

        console.log('\n••• Testing the breaking flow...');

        roll([
            breakingFunction,
            ghostFunction
        ], (err, result) => {
            console.log('√ breakingFlowCallback successfully called');
            results.push('breakingFlowCallback');

            if (err === 'Error') {
                console.log('√ breakingFlowCallback correctly got error');
            } else {
                console.log("ERR!! breakingFlowCallback should have an error.");
                errCount++;
            }

            if (result === 'result') {
                console.log('√ result successfully passed on');
            } else {
                console.log("ERR!! result wasn't passed on after the error.");
                errCount++;
            }

            cb();
        });
    }
], () => {

    console.log('\n••• So. How did we do?');

    if (errCount === 0) {
        console.log('√ 0 errors!');
    } else {
        console.log(errCount + ' errors. Work on it please!');
    }

    var resultsShouldBe = ['firstFunction', 'secondFunction', 'thirdFunction', 'happyFlowCallback', 'breakingFunction', 'breakingFlowCallback'];

    var isResultsCorrect = checkArraysEqual(results, resultsShouldBe);

    if (isResultsCorrect) {
        console.log('√ The correct set of functions was called');
    } else {
        console.log('ERR!! results should be:\n', resultsShouldBe);
        console.log('instead it is\n', results);
    }
});


/*
    Did the tests run at all?
 */

setTimeout(function() {
    if (results.length === 0) {
        console.log('\nERR!! The tests were unable to run\n');
    }
}, 500);
