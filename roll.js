'use strict';
/*
Let's write a simple function to replace async.waterfall !

 What it does:
 - take a bunch of functions
 - call the functions one by one
 - Every function is given a last argument, cb, that should be called in it
 - Every cb call should first call ...
 - Between the err and cb, give each function the arguments the previous one was given
 - If err is truthy, the last function is immediately called, otherwise we just roll on to the next until the last

 Extra's:
 - Allow giving first function argument(s)
 - More flexible passing (harder for readability!)
 */

function roll (tasks, callback) {

    var cb = function(err) {
        var args = Array.from(arguments);
        args.splice(0, 1);
        if (err || tasks.length <= 1) {
            return callback(...arguments);
        }
        tasks.splice(0, 1); // remove first argument, which is this function
        tasks[0] = tasks[0].bind(null, ...args);
        roll(tasks, callback);
    };

    tasks[0].call(null, cb);
}

/* TEST */
roll([
    function(callback) {
        console.log('typeof callback (should be a function)', typeof callback);
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        console.log('arg1 (should equal "one")', arg1);
        console.log('arg2 (should equal "two")', arg2);
        callback('error', 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        console.log('arg1 (should equal "three")', arg1);
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
    // console.log('result (should equal "done")', result);
    console.log('err (should be "error")', err);
});
