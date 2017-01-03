/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scout');
 * mod.thing == 'a thing'; // true
 */
var scout = {
    // Function will get all neigbour rooms.
    fn_get_avail_rooms: function(creep) {
        // Get current room name.
        var current_room = creep.room.name;
        // Get all availible exits from this room
        var current_room_connecions = Game.map.describeExits(current_room);
        if (!creep.room.memory.connected) {
            creep.room.memory.connected = {};
        }
        
        for(var room_i in current_room_connecions) {
           if (!creep.room.memory.connected[current_room_connecions[room_i]]) {
               creep.room.memory.connected[current_room_connecions[room_i]] = {
                   name: current_room_connecions[room_i],
                   visited: false,
                   resource_energy: 0,
                   owner: false,
                   danger: 0,
               }
           }
        }
    },
    run: function(creep) {
        this.fn_get_avail_rooms(creep);
        this.check_room(creep);
    },
    check_room: function(creep) {
        if (creep.room.name != creep.memory.room) {
            var room = Game.rooms[creep.memory.room].memory.connected[creep.room.name];
            // Get sources.
            var sources = creep.room.find(FIND_SOURCES);
            if (!room.sources_locations) {
                room.sources_locations = {};
            }
            for (var i in sources) {
                var sid = sources[i].id;
                if (!room.sources) {
                    room.sources = {};
                }
                //if (!room.sources[sid]) {
                    room.sources[sid] = [];
                    room.sources_locations[sid] = sources[i].pos;
                //}
            }
            // Findout if room is free.
            var targetSpawn = creep.room.find(FIND_HOSTILE_SPAWNS);
            if (targetSpawn.length != 0) {
                room.owner = true;
                // Set danger level.
                room.danger = 100;
            }
            else {
                room.owner = false;
                // Set danger level.
                room.danger = 0;
            }
            // Update visited time.
            room.visited = Game.time;
            var start_room = Game.rooms[creep.memory.room];
           // console.log(Game.rooms[creep.memory.room]);
            // Get back to home.
            var route = Game.map.findRoute(creep.room, creep.memory.room);
            if(route.length > 0) {
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }
        }
        else {
            for (var i in creep.room.memory.connected) {
                var connection = creep.room.memory.connected[i];
                var tick = Game.time;
                if (connection.visited === false || (Game.time - connection.visited) > 500) {
                    //console.log(connection.name);
                    var route = Game.map.findRoute(creep.room, connection.name);
                    if(route.length > 0) {
                        //console.log('Now heading to room '+route[0].room);
                        var exit = creep.pos.findClosestByRange(route[0].exit);
                        creep.moveTo(exit);
                    }
                    break;
                }
            }
        }
    }
}

module.exports = scout;