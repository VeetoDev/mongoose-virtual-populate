This mongoose plugin allows for double-binding of array values in mongoose schema paths
 in a way that allows for dynamic population, which the normal path array structure does not.
 
 
 Example:
 
 old world:
 
 defining a key as an object array in a mongoose scheam like so:
 
 var model = Mongoose.model('members', {
    leads: [{type: Mongoose.Schema.types.ObjectId, ref: 'lead'}]
 });
 
 is unwieldy in the database, and doesnt allow for implicit array population.
 
 new world:
 
 var model = Mongoose.model('members', {
    leads: [{type: Mongoose.Schema.ObjectId, ref: 'lead', linked: true, field: reverseField}]
 });
 
 What this does:
 
 1. the leads array is no longer stored in the members objects. This keeps the members objects short.
 
 2. now, you can create a new lead, and if the path 'reverseField' for that lead has the ID of a members object, that lead will *automatically* appear in the leads array of the members document
 
 
 
 
 Note: this is still a pre-alpha plugin meant to supplement a larger plugin, and is not properly tested, documented, or vetting for widespread use currently.
 
 Note: the technical underpinning for this plugin is based on the mongoose virtual populate function released in version 4.5.0
 