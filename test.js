'use strict';

import test from 'ava';
import roll from './roll';

test('functionsAreCalled', t => {

    t.plan(4);

    var one = (cb) => {
        t.pass();
        cb();
    };

    var two = (cb) => {
        t.pass();
        cb();
    };

    var three = (cb) => {
        t.pass();
        cb();
    };

    roll([one, two, three], () => {
        t.pass();
    });
});



test('argumentsArePassedOn', t => {

    t.plan(6);

    var one = (callback) => {
        callback(null, 'firstArg');
    };

    var two = (arg1, callback) => {
        t.is(arg1, 'firstArg');
        callback(null, ['secondArg'], {arg3: 'thirdArg'});
    };

    var three = (arg2, arg3, callback) => {
        t.deepEqual(arg2, ['secondArg']);
        t.deepEqual(arg3, {arg3: 'thirdArg'});

        callback(null, 'done');
    };

    roll([
        one,
        two,
        three,
    ], (err, lastArg, nonexistentArg) => {
        t.is(err, null);
        t.is(lastArg, 'done');
        t.is(nonexistentArg, undefined);
    });
});



test('breaksCorrectly', t => {

    t.plan(3);

    var breakingFunction = (callback) => {
        t.pass();
        callback('Error', 'result');
    };

    var ghostFunction = (callback) => {
        t.fail();
        callback();
    };

    roll([
        breakingFunction,
        ghostFunction
    ], (err, result) => {
        t.is(err, 'Error');
        t.is(result, 'result');
    });
});
