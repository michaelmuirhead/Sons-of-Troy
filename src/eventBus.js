/**
 * Tiny pub/sub event bus used to communicate between React UI and the Phaser
 * game scene. Both sides import this module; the Phaser scene emits state
 * updates and story events, React components subscribe to render the HUD.
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const set = this.listeners.get(event);
    if (set) set.delete(handler);
  }

  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      try {
        handler(payload);
      } catch (err) {
        console.error(`[eventBus] handler for "${event}" threw:`, err);
      }
    }
  }
}

export const eventBus = new EventBus();

// Event name constants — grep-friendly
export const EVT = {
  STATE_UPDATE: 'state:update',
  LOG: 'log:entry',
  EVENT_FIRE: 'event:fire',
  EVENT_CHOICE: 'event:choice',
};
