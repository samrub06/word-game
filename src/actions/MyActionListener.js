class MyActionListener {
  constructor() {
    this.listeners = {};
  }

  // Add a listener to an action
  registerListener(action, listener) {
    if (!this.listeners[action]) {
      this.listeners[action] = [];
    }
    this.listeners[action].push(listener);
  }

  // Remove all listeners for an action
  removeListener(action) {
    delete this.listeners[action];
  }

  // Emit the action to all registered listeners
  emit(action, data) {
    if (!this.listeners[action]) {
      throw new Error(`Can't emit an event. Event "${action}" doesn't exits.`);
    }
    this.listeners[action].forEach((listener) => listener(data));
  }

  // Handle physical keyboard events
  handlePhysicalKey = (e) => {
    let key = e.key.toUpperCase();
    if (key === 'BACKSPACE') key = 'BACK';
    if (key === 'ENTER') key = 'ENTER';
    if (
      (key.length === 1 && key >= 'A' && key <= 'Z') ||
      key === 'ENTER' ||
      key === 'BACK'
    ) {
      this.emit('KEY_PRESS', key);
    }
  }
}

export default MyActionListener; 