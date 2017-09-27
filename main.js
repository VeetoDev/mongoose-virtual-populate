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
    if(!schema.options.autoPopulateFields){
        schema.options.autoPopulateFields = [];
    }
    for (var i = 0, pathKeys = Object.keys(paths); i < pathKeys.length; i++) {
        var field = pathKeys[i];
        var obj = paths[field];
        if (!!obj && obj.$isMongooseArray && obj.caster.options.linked === true) {

            var objOptions = obj.caster.options;
            var localField = objOptions.localField || '_id';
            var virtualRef = objOptions.ref;
            var foreignField = objOptions.field || (virtualRef.charAt(0).toUpperCase() + virtualRef.slice(1));
            schema.remove(field);
            schema.virtual(field, {
                ref: virtualRef,
                localField: localField,
                foreignField: foreignField
            });
            schema.options.autoPopulateFields.push(field);
            var autoPopulateLink = function (next) {
                if(!this.schema.options.autoPopulateFields){
                    next();
                    return;
                }
                for(var i = 0; i < this.schema.options.autoPopulateFields.length; i++){
                    this.populate(this.schema.options.autoPopulateFields[i]);
                }
                next();
            };
            schema
                .pre('findOne', autoPopulateLink)
                .pre('find', autoPopulateLink)
                .pre('findById', autoPopulateLink);
        }
    }

}