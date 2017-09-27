/**
 * Created by matt on 9/21/17.
 */
var mongoose = require('mongoose');

//needs error handling
module.exports = function (schema, options) {
    var paths = schema.paths;
    if (!options) {
        options = {};
    }
    if (!global.globalBindingFields) {
        global.globalBindingFields = {};
    }
    options.virtualPaths = [];
    for (var i = 0, pathKeys = Object.keys(paths); i < pathKeys.length; i++) {
        var field = pathKeys[i];
        var obj = paths[field];
        if (!!obj && obj.$isMongooseArray && obj.caster.options.linked === true) {

            var objOptions = obj.caster.options;
            options.virtualPaths.push(field);
            var localField = objOptions.localField || '_id';
            var virtualRef = objOptions.ref;
            var foreignField = objOptions.field || (virtualRef.charAt(0).toUpperCase() + virtualRef.slice(1));
            schema.remove(field);
            schema.virtual(field, {
                ref: virtualRef,
                localField: localField,
                foreignField: foreignField
            });
            globalBindingFields.field = field;
            var autoPopulateLink = function (next) {
                this.populate(globalBindingFields.field);

                next();
            };
            schema
                .pre('findOne', autoPopulateLink)
                .pre('find', autoPopulateLink)
                .pre('findById', autoPopulateLink);
        }
    }

}