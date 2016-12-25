var creepRoleController = require('role.controller');

var roleUpgrader = {
    sources: [],
    interact_with_source: function(creep) {
       // console.log(creep.memory.tid);
        var sources_found = creep.room.find(FIND_SOURCES);
        if (creep.memory.tid == '') {
           // If creep needs to find a source.
           for (var n in sources_found) {
               if (sources_found[n].length > 1) {
                   continue;
               }
               var sid = sources_found[n].id;
               // Run over the sources and find where we can place our creep.
               if (!this.sources[sid]) {
                   this.sources[sid] = [creep.name];
                   creep.memory.tid = sid;
                   break;
               }
               else {
                   var found = false;
                    for(var unid in this.sources[sid]) {
                        if (this.sources[sid][unid] == creep.name) {
                            found = true;
                        }
                        if (found == false) {
                            creep.memory.tid = sid;
                            this.sources[sid].push(creep.name);
                        }
                    }
               }
           }
        }
        else {
            var source = Game.getObjectById(creep.memory.tid);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        return creep;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // Set role back if creep has other role before.
        if (creep.memory.role != creep.memory.temp_role) {
            var creep = creepRoleController.checkBack(creep);
        }
        // Only for creeps with upgrader role.
        if (creep.memory.role == 'upgrader') {
            if(creep.carry.energy == 0) {
                creep.memory.charging = true;
                //var source = Game.getObjectById('5836b6588b8b9619519ee8c5');
                //var source = creep.pos.findClosestByPath(FIND_SOURCES);
                creep = this.interact_with_source(creep);
                //console.log(creep.name + " empty " + source);
    	    }
    	    else {
    	        //console.log(creep.name + " " + creep.memory.charging);
    	        // Check if we are not full, continue charging.
    	        if (creep.memory.charging == true && creep.carryCapacity != creep.carry.energy) {
    	            creep = this.interact_with_source(creep);
    	        }
    	        // Reset flag to false, ot will say that we are charged.
    	        if (creep.memory.charging == true && creep.carryCapacity == creep.carry.energy) {
    	            //console.log("FULL");
    	            creep.memory.charging = false;
    	        }
    	        // Find upgradeController and upgrade it.
    	        if ( creep.memory.charging == false) {
    	            if (creep.memory.tid != '') {
    	                for (var n in this.sources[creep.memory.tid]) {
    	                    if (this.sources[creep.memory.tid][n] == creep.name) {
    	                        this.sources[creep.memory.tid][n].splice(n, 1);
    	                        break;
    	                    }
    	                }
    	                creep.memory.tid = '';
    	            }
    	            
    	            //console.log(creep.name + " moving to upgrade");
        	        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
    	        }
    	    }
        }
	}
};

module.exports = roleUpgrader;