/**
 * Super Mario Advanced - System Manager
 * Manages all systems in the ECS architecture
 */

export default class SystemManager {
    constructor(game) {
        this.game = game;
        this.systems = new Map();
        this.systemOrder = [];
        this.systemGroups = {
            input: [],
            logic: [],
            physics: [],
            rendering: []
        };
        
        console.log('⚙️ SystemManager initialized');
    }

    addSystem(name, system, group = 'logic', priority = 0) {
        if (this.systems.has(name)) {
            console.warn(`⚠️ System '${name}' already exists, replacing...`);
        }
        
        // Initialize system
        system.name = name;
        system.game = this.game;
        system.priority = priority;
        system.enabled = true;
        system.group = group;
        
        // Add initialization method if not present
        if (!system.init) {
            system.init = () => {};
        }
        
        // Add update method if not present
        if (!system.update) {
            system.update = (deltaTime) => {};
        }
        
        // Add cleanup method if not present
        if (!system.cleanup) {
            system.cleanup = () => {};
        }
        
        this.systems.set(name, system);
        
        // Add to appropriate group
        if (this.systemGroups[group]) {
            this.systemGroups[group].push(system);
            // Sort by priority (higher priority runs first)
            this.systemGroups[group].sort((a, b) => b.priority - a.priority);
        }
        
        // Update system order
        this.updateSystemOrder();
        
        // Initialize the system
        system.init();
        
        console.log(`⚙️ Added system '${name}' to group '${group}' with priority ${priority}`);
        return system;
    }

    removeSystem(name) {
        const system = this.systems.get(name);
        if (!system) {
            console.warn(`⚠️ System '${name}' not found`);
            return false;
        }
        
        // Cleanup system
        system.cleanup();
        
        // Remove from group
        const group = this.systemGroups[system.group];
        if (group) {
            const index = group.indexOf(system);
            if (index !== -1) {
                group.splice(index, 1);
            }
        }
        
        // Remove from systems map
        this.systems.delete(name);
        
        // Update system order
        this.updateSystemOrder();
        
        console.log(`⚙️ Removed system '${name}'`);
        return true;
    }

    getSystem(name) {
        return this.systems.get(name);
    }

    hasSystem(name) {
        return this.systems.has(name);
    }

    enableSystem(name) {
        const system = this.systems.get(name);
        if (system) {
            system.enabled = true;
            console.log(`⚙️ Enabled system '${name}'`);
            return true;
        }
        return false;
    }

    disableSystem(name) {
        const system = this.systems.get(name);
        if (system) {
            system.enabled = false;
            console.log(`⚙️ Disabled system '${name}'`);
            return true;
        }
        return false;
    }

    updateSystemOrder() {
        this.systemOrder = [];
        
        // Add systems in group order: input -> logic -> physics -> rendering
        const groupOrder = ['input', 'logic', 'physics', 'rendering'];
        
        for (const groupName of groupOrder) {
            const group = this.systemGroups[groupName];
            if (group) {
                this.systemOrder.push(...group);
            }
        }
    }

    update(deltaTime) {
        for (const system of this.systemOrder) {
            if (system.enabled) {
                try {
                    system.update(deltaTime);
                } catch (error) {
                    console.error(`❌ Error in system '${system.name}':`, error);
                    // Optionally disable the system to prevent further errors
                    system.enabled = false;
                }
            }
        }
    }

    // Group-specific update methods
    updateInputSystems(deltaTime) {
        for (const system of this.systemGroups.input) {
            if (system.enabled) {
                system.update(deltaTime);
            }
        }
    }

    updateLogicSystems(deltaTime) {
        for (const system of this.systemGroups.logic) {
            if (system.enabled) {
                system.update(deltaTime);
            }
        }
    }

    updatePhysicsSystems(deltaTime) {
        for (const system of this.systemGroups.physics) {
            if (system.enabled) {
                system.update(deltaTime);
            }
        }
    }

    updateRenderingSystems(deltaTime) {
        for (const system of this.systemGroups.rendering) {
            if (system.enabled) {
                system.update(deltaTime);
            }
        }
    }

    // System management
    getAllSystems() {
        return Array.from(this.systems.values());
    }

    getSystemsByGroup(group) {
        return this.systemGroups[group] ? [...this.systemGroups[group]] : [];
    }

    getEnabledSystems() {
        return this.getAllSystems().filter(system => system.enabled);
    }

    getDisabledSystems() {
        return this.getAllSystems().filter(system => !system.enabled);
    }

    // Utility methods
    pauseAllSystems() {
        for (const system of this.systems.values()) {
            if (system.pause) {
                system.pause();
            }
        }
        console.log('⚙️ All systems paused');
    }

    resumeAllSystems() {
        for (const system of this.systems.values()) {
            if (system.resume) {
                system.resume();
            }
        }
        console.log('⚙️ All systems resumed');
    }

    enableAllSystems() {
        for (const system of this.systems.values()) {
            system.enabled = true;
        }
        console.log('⚙️ All systems enabled');
    }

    disableAllSystems() {
        for (const system of this.systems.values()) {
            system.enabled = false;
        }
        console.log('⚙️ All systems disabled');
    }

    // Cleanup
    cleanup() {
        for (const system of this.systems.values()) {
            system.cleanup();
        }
        
        this.systems.clear();
        this.systemOrder.length = 0;
        
        for (const group of Object.values(this.systemGroups)) {
            group.length = 0;
        }
        
        console.log('⚙️ SystemManager cleaned up');
    }

    // Debug methods
    getDebugInfo() {
        const systemInfo = {};
        
        for (const [name, system] of this.systems) {
            systemInfo[name] = {
                enabled: system.enabled,
                group: system.group,
                priority: system.priority
            };
        }
        
        return {
            totalSystems: this.systems.size,
            enabledSystems: this.getEnabledSystems().length,
            disabledSystems: this.getDisabledSystems().length,
            systemGroups: Object.fromEntries(
                Object.entries(this.systemGroups).map(([group, systems]) => [
                    group,
                    systems.length
                ])
            ),
            systems: systemInfo
        };
    }

    logDebugInfo() {
        const info = this.getDebugInfo();
        console.log('⚙️ SystemManager Debug Info:');
        console.table(info.systems);
        console.log(`Total systems: ${info.totalSystems}`);
        console.log(`Enabled: ${info.enabledSystems}, Disabled: ${info.disabledSystems}`);
        console.log('Group distribution:', info.systemGroups);
    }

    // Performance monitoring
    measureSystemPerformance(deltaTime) {
        const performance = {};
        
        for (const system of this.systemOrder) {
            if (!system.enabled) continue;
            
            const startTime = performance.now();
            system.update(deltaTime);
            const endTime = performance.now();
            
            performance[system.name] = {
                executionTime: endTime - startTime,
                group: system.group,
                priority: system.priority
            };
        }
        
        return performance;
    }
}

