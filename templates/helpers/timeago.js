'use strict';

const Handlebars = require('handlebars');
const ta = require('time-ago')();

module.exports = function (date) {

    let text = ta.ago(date);
    return new Handlebars.SafeString(text);
};
