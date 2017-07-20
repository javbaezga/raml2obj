'use strict';

/**
 * Analyzer analyze performance of the script.
 */

class PerformanceAnalyzer {

  constructor(enabled) {
    this.hasSupport = enabled && this._hasSupport();
  }

  _hasSupport() {
    return !!(typeof performance !== 'undefined' &&
      performance.mark &&
      performance.clearMeasures &&
      performance.measure);
  }
  /**
   * Uses the performance API to mark time of an event.
   */
  mark(title) {
    if (!this.hasSupport) {
      return;
    }
    performance.mark(title);
  }

  /**
   * Returns a list of time measurements for given key.
   *
   * The `key` must have corresponding `key` + `start` and `key` + `end`
   * markings in the performance timeline.
   *
   * @param {Array<String>} keys List of keys to return.
   * @return {Array<Object>} List of measurements taken for the key.
   */
  getMeasurements(keys) {
    if (!this.hasSupport) {
      return [];
    }
    performance.clearMeasures();
    keys.forEach(key => {
      try {
        performance.measure(key, key + '-start', key + '-end');
      } catch (e) {}
    });
    var result = performance.getEntriesByType('measure');
    return result.map(item => {
      return {
        name: item.name,
        startTime: item.startTime,
        duration: item.duration
      };
    });
  }
}

module.exports.PerformanceAnalyzer = PerformanceAnalyzer;
