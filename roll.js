'use strict';

function roll (tasks, callback) {

    var cb = function(err) {
        // Break if cb was given an error or this was the last function
        if (err || tasks.length <= 1) {
            return callback(...arguments);
        }
        // Put the arguments (except err) on the next task
        var args = [...arguments];
        args.splice(0, 1);
        tasks[1] = tasks[1].bind(null, ...args);

        // Delete the done task, repeat the process with the next
        tasks.splice(0, 1);
        roll(tasks, callback);
    };

    // Execute the first task in the list
    tasks[0].call(null, cb);
}

module.exports = roll;
