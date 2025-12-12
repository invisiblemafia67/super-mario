/**
 * Super Mario Advanced - Component Manager
 * Manages all components in the ECS system
 */

export default class ComponentManager {
    constructor() {
        this.components = new Map(); // componentType -> Map(entityId -> componentData)
        this.entityComponents = new Map(); // entityId -> Set(componentTypes)
        
        console.log('🧩 ComponentManager initialized');
    }

    addComponent(entityId, componentType, componentData = {}) {
        // Initialize component type storage if needed
        if (!this.components.has(componentType)) {
            this.components.set(componentType, new Map());
        }
        
        // Initialize entity component tracking if needed
        if (!this.entityComponents.has(entityId)) {
            this.entityComponents.set(entityId, new Set());
        }
        
        // Store component data
        this.components.get(componentType).set(entityId, { ...componentData });
        this.entityComponents.get(entityId).add(componentType);
        
        return true;
    }

    removeComponent(entityId, componentType) {
        const componentMap = this.components.get(componentType);
        if (componentMap) {
            componentMap.delete(entityId);
            
            // Clean up empty component type
            if (componentMap.size === 0) {
                this.components.delete(componentType);
            }
        }
        
        const entityComponentSet = this.entityComponents.get(entityId);
        if (entityComponentSet) {
            entityComponentSet.delete(componentType);
            
            // Clean up empty entity
            if (entityComponentSet.size === 0) {
                this.entityComponents.delete(entityId);
            }
        }
        
        return true;
    }

    getComponent(entityId, componentType) {
        const componentMap = this.components.get(componentType);
        return componentMap ? componentMap.get(entityId) : undefined;
    }

    hasComponent(entityId, componentType) {
        const componentMap = this.components.get(componentType);
        return componentMap ? componentMap.has(entityId) : false;
    }

    updateComponent(entityId, componentType, updates) {
        const component = this.getComponent(entityId, componentType);
        if (component) {
            Object.assign(component, updates);
            return true;
        }
        return false;
    }

    getEntityComponents(entityId) {
        const componentTypes = this.entityComponents.get(entityId);
        if (!componentTypes) return {};
        
        const result = {};
        for (const componentType of componentTypes) {
            result[componentType] = this.getComponent(entityId, componentType);
        }
        return result;
    }

    getAllComponentsOfType(componentType) {
        const componentMap = this.components.get(componentType);
        return componentMap ? Array.from(componentMap.entries()) : [];
    }

    getEntitiesWithComponent(componentType) {
        const componentMap = this.components.get(componentType);
        return componentMap ? Array.from(componentMap.keys()) : [];
    }

    getEntitiesWithComponents(...componentTypes) {
        if (componentTypes.length === 0) return [];
        
        // Start with entities that have the first component type
        let entities = this.getEntitiesWithComponent(componentTypes[0]);
        
        // Filter to only include entities that have ALL required components
        for (let i = 1; i < componentTypes.length; i++) {
            const componentType = componentTypes[i];
            entities = entities.filter(entityId => this.hasComponent(entityId, componentType));
        }
        
        return entities;
    }

    getEntitiesWithAnyComponent(...componentTypes) {
        const entitySet = new Set();
        
        for (const componentType of componentTypes) {
            const entities = this.getEntitiesWithComponent(componentType);
            entities.forEach(entityId => entitySet.add(entityId));
        }
        
        return Array.from(entitySet);
    }

    removeAllComponents(entityId) {
        const componentTypes = this.entityComponents.get(entityId);
        if (componentTypes) {
            for (const componentType of componentTypes) {
                this.removeComponent(entityId, componentType);
            }
        }
    }

    // Component type management
    getComponentTypes() {
        return Array.from(this.components.keys());
    }

    getComponentCount(componentType) {
        const componentMap = this.components.get(componentType);
        return componentMap ? componentMap.size : 0;
    }

    getTotalComponentCount() {
        let total = 0;
        for (const componentMap of this.components.values()) {
            total += componentMap.size;
        }
        return total;
    }

    // Utility methods for common component operations
    setPosition(entityId, x, y) {
        return this.updateComponent(entityId, 'transform', { x, y });
    }

    getPosition(entityId) {
        const transform = this.getComponent(entityId, 'transform');
        return transform ? { x: transform.x, y: transform.y } : null;
    }

    setVelocity(entityId, vx, vy) {
        return this.updateComponent(entityId, 'physics', { vx, vy });
    }

    getVelocity(entityId) {
        const physics = this.getComponent(entityId, 'physics');
        return physics ? { vx: physics.vx, vy: physics.vy } : null;
    }

    setSprite(entityId, image, offsetX = 0, offsetY = 0) {
        return this.updateComponent(entityId, 'sprite', { image, offsetX, offsetY });
    }

    // Batch operations
    batchUpdateComponents(componentType, updates) {
        const componentMap = this.components.get(componentType);
        if (!componentMap) return 0;
        
        let updateCount = 0;
        for (const [entityId, component] of componentMap) {
            if (typeof updates === 'function') {
                updates(component, entityId);
            } else {
                Object.assign(component, updates);
            }
            updateCount++;
        }
        
        return updateCount;
    }

    // Query system for complex component queries
    query(filter) {
        const results = [];
        
        for (const [entityId, componentTypes] of this.entityComponents) {
            const entityData = {
                entityId,
                components: {}
            };
            
            // Gather all components for this entity
            for (const componentType of componentTypes) {
                entityData.components[componentType] = this.getComponent(entityId, componentType);
            }
            
            // Apply filter
            if (filter(entityData)) {
                results.push(entityData);
            }
        }
        
        return results;
    }

    // Cleanup
    clear() {
        this.components.clear();
        this.entityComponents.clear();
        console.log('🧩 ComponentManager cleared');
    }

    // Debug methods
    getDebugInfo() {
        const componentStats = {};
        for (const [componentType, componentMap] of this.components) {
            componentStats[componentType] = componentMap.size;
        }
        
        return {
            totalComponents: this.getTotalComponentCount(),
            componentTypes: this.components.size,
            entitiesWithComponents: this.entityComponents.size,
            componentStats
        };
    }

    logDebugInfo() {
        const info = this.getDebugInfo();
        console.log('🧩 ComponentManager Debug Info:');
        console.table(info.componentStats);
        console.log(`Total components: ${info.totalComponents}`);
        console.log(`Component types: ${info.componentTypes}`);
        console.log(`Entities with components: ${info.entitiesWithComponents}`);
    }
}

