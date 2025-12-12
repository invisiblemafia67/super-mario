/**
 * Super Mario Advanced - Entity Manager
 * Manages entity creation, destruction, and lifecycle
 */

export default class EntityManager {
    constructor() {
        this.entities = new Map();
        this.nextEntityId = 1;
        this.entityTypes = new Map();
        this.freeIds = [];
        
        console.log('🎭 EntityManager initialized');
    }

    createEntity(type = 'generic') {
        // Reuse freed IDs or create new one
        const id = this.freeIds.length > 0 ? this.freeIds.pop() : this.nextEntityId++;
        
        const entity = {
            id,
            type,
            active: true,
            created: performance.now(),
            components: new Set()
        };
        
        this.entities.set(id, entity);
        
        // Track entity types
        if (!this.entityTypes.has(type)) {
            this.entityTypes.set(type, new Set());
        }
        this.entityTypes.get(type).add(id);
        
        console.log(`🎭 Created entity ${id} of type '${type}'`);
        return id;
    }

    destroyEntity(entityId) {
        const entity = this.entities.get(entityId);
        if (!entity) {
            console.warn(`⚠️ Attempted to destroy non-existent entity ${entityId}`);
            return false;
        }
        
        // Remove from type tracking
        const typeSet = this.entityTypes.get(entity.type);
        if (typeSet) {
            typeSet.delete(entityId);
            if (typeSet.size === 0) {
                this.entityTypes.delete(entity.type);
            }
        }
        
        // Remove entity
        this.entities.delete(entityId);
        this.freeIds.push(entityId);
        
        console.log(`🎭 Destroyed entity ${entityId}`);
        return true;
    }

    getEntity(entityId) {
        return this.entities.get(entityId);
    }

    hasEntity(entityId) {
        return this.entities.has(entityId);
    }

    getAllEntities() {
        return Array.from(this.entities.keys());
    }

    getEntitiesByType(type) {
        const typeSet = this.entityTypes.get(type);
        return typeSet ? Array.from(typeSet) : [];
    }

    getActiveEntities() {
        return Array.from(this.entities.entries())
            .filter(([id, entity]) => entity.active)
            .map(([id, entity]) => id);
    }

    setEntityActive(entityId, active) {
        const entity = this.entities.get(entityId);
        if (entity) {
            entity.active = active;
            return true;
        }
        return false;
    }

    isEntityActive(entityId) {
        const entity = this.entities.get(entityId);
        return entity ? entity.active : false;
    }

    addComponentToEntity(entityId, componentType) {
        const entity = this.entities.get(entityId);
        if (entity) {
            entity.components.add(componentType);
            return true;
        }
        return false;
    }

    removeComponentFromEntity(entityId, componentType) {
        const entity = this.entities.get(entityId);
        if (entity) {
            entity.components.delete(componentType);
            return true;
        }
        return false;
    }

    entityHasComponent(entityId, componentType) {
        const entity = this.entities.get(entityId);
        return entity ? entity.components.has(componentType) : false;
    }

    getEntitiesWithComponents(...componentTypes) {
        const result = [];
        
        for (const [entityId, entity] of this.entities) {
            if (!entity.active) continue;
            
            const hasAllComponents = componentTypes.every(type => 
                entity.components.has(type)
            );
            
            if (hasAllComponents) {
                result.push(entityId);
            }
        }
        
        return result;
    }

    getEntitiesWithAnyComponent(...componentTypes) {
        const result = [];
        
        for (const [entityId, entity] of this.entities) {
            if (!entity.active) continue;
            
            const hasAnyComponent = componentTypes.some(type => 
                entity.components.has(type)
            );
            
            if (hasAnyComponent) {
                result.push(entityId);
            }
        }
        
        return result;
    }

    // Utility methods
    getEntityCount() {
        return this.entities.size;
    }

    getActiveEntityCount() {
        return this.getActiveEntities().length;
    }

    getEntityTypeCount(type) {
        const typeSet = this.entityTypes.get(type);
        return typeSet ? typeSet.size : 0;
    }

    getAllEntityTypes() {
        return Array.from(this.entityTypes.keys());
    }

    clear() {
        this.entities.clear();
        this.entityTypes.clear();
        this.freeIds.length = 0;
        this.nextEntityId = 1;
        console.log('🎭 EntityManager cleared');
    }

    // Debug methods
    getDebugInfo() {
        return {
            totalEntities: this.entities.size,
            activeEntities: this.getActiveEntityCount(),
            entityTypes: Object.fromEntries(
                Array.from(this.entityTypes.entries()).map(([type, set]) => [type, set.size])
            ),
            nextId: this.nextEntityId,
            freeIds: this.freeIds.length
        };
    }

    logDebugInfo() {
        const info = this.getDebugInfo();
        console.table(info);
    }
}

