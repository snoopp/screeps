Spawn.prototype.fn_build_extentions = function() {
    if (!this.room.memory.extensions) {
       this.room.memory.extensions = 0;
    }
    var extensions_avail = 0;
    switch(this.room.controller.level) {
        case 1:
            extensions_avail = 0;
        break;
        case 2:
            extensions_avail = 5;
        break;
        case 3:
            extensions_avail = 10; 
        break;
        default:
            extensions_avail = this.room.controller.level * 10 - 20;
        break;
    }
   
    var target_1 = new RoomPosition(this.fn_calculate_posible_path(this.pos.x - 16), 
        this.fn_calculate_posible_path(this.pos.y - 16), 
        this.pos.roomName
    );
    var new_x = this.fn_calculate_posible_path(this.pos.x - 8);
    var new_y = this.fn_calculate_posible_path(this.pos.y - 8);
    var flag_break = false;
   
   console.log(this.room.memory.extensions)
   
    if (this.room.memory.extensions < extensions_avail) {
        do {
            for (var y = 0; y < 20; y+=2) {
                for (var x = 0; x < 20; x+=2) {
                    if (this.room.memory.extensions < extensions_avail) {
                        var pos_x = new_x + x;
                        var pos_y = new_y + y;
                        var roomPosition = this.room.getPositionAt(pos_x, pos_y);
                        if (this.room.lookForAt('structure', roomPosition).length == 0 && 
                            this.room.lookForAt('constructionSite', roomPosition).length == 0) {
                                // Build for a structure.
                                this.room.createConstructionSite(roomPosition, STRUCTURE_EXTENSION);
                                this.room.memory.extensions++;
                        }
                    }
                }
            }
        }
        while (this.room.memory.extensions < extensions_avail);
    }
}

Spawn.prototype.fn_calculate_posible_path = function(coordinates) {
    var min = 0;
    var max = 49;
    if (coordinates > 49) {
        coordinates = 49;
    }
    if (coordinates < 0) {
        coordinates = 0;
    }
    
    return coordinates;
}

// This function will build roads and connects all structures in the room.
Spawn.prototype.fn_build_roads = function() {
    // Find sources and build roads from them to room controller,
    // and from spawn to sources
    var sources = this.room.find(FIND_SOURCES);
    for (var source_i in sources) {
        var source = sources[source_i];
        // Road from source to controller.
        var path = this.room.findPath(source.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
        this.fn_create_construction_sites(path, STRUCTURE_ROAD);
        // Road from Spawn to source.
        var path = this.room.findPath(this.pos, source.pos, {ignoreRoads: true, ignoreCreeps:true});
        this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    }
    // Road from spawn to controller.
    var path = this.room.findPath(this.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
    this.fn_create_construction_sites(path, STRUCTURE_ROAD);
}

// This function will create a structure on a given path.
Spawn.prototype.fn_create_construction_sites = function(path, construction) {
    // Run over the path and build something on its locations.
    for (var index in path) {
        var item = path[index];
        var roomPosition = this.room.getPositionAt(item.x, item.y);
        // If there is an empty place.
        if (this.room.lookForAt('structure', roomPosition).length == 0 && 
        this.room.lookForAt('constructionSite', roomPosition).length == 0) {
            // Build for a structure.
            this.room.createConstructionSite(roomPosition, construction);
        }
    }
}