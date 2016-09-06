(function() {

'use strict';

module.exports = function() {
    return {
        name: process.env.NODE_DEV ? process.env.NODE_DEV : 'production'
    };
};

})();
