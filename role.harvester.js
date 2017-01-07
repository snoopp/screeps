var creepRoleController = require('role.controller');
var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                            }
                        });
        if (targets.length == 0) {
            creep = creepRoleController.checkIfHarvesterIsFree(creep);
        }
       
        if (creep.memory.role == 'harvester') {
            if (creep.carry.energy < creep.carryCapacity) {
                creep = creepRoleController.interact_with_source(creep);
    	        //creepRoleController.fn_creep_move_to_source(creep);
            }
            else {
                if (creep.room.name != creep.memory.home_room) {
                    var room_pos_name =  creep.memory.home_room;
                    var route = Game.map.findRoute(creep.room.name, room_pos_name);
                    var exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit);
                }
                else {
                    // var targets = creep.room.find(FIND_STRUCTURES, {
                    //     filter: (structure) => {
                    //         return (structure.structureType == STRUCTURE_EXTENSION ||
                    //                 structure.structureType == STRUCTURE_SPAWN ||
                    //                 structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    //         }
                    //     });
                        
                    var flag_tower_found = false;
        	        
            	    // Search for a targets that will be a tower.
            	    for (var i in targets) {
            	        // If this is tower change flag to false and move creep to it.
            	        if (targets[i].structureType == 'tower') {
                            if(creep.transfer(targets[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[i]);
                                flag_tower_found = true;
            	                break;
                            }
            	        } 
            	    }
                        
                    if (flag_tower_found == false) {
                        if(targets.length > 0) {
                            creep = creepRoleController.fn_creem_from_source(creep);
                            if(creep && creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[0]);
                            }
                        }
                    }
                }
            }
        }
	}
};

module.exports = roleHarvester;