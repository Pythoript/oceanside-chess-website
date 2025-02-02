class Timer {
 constructor() {
    this.isRunning = false;
    /** @type {number} */
    this.overallTime = this.startTime = 0;
 }

 /**
  * @returns {number}
  * @private
  */
 _getTimeElapsedSinceLastStart() {
    return this.startTime ? performance.now() - this.startTime : 0;
 }

 start() {
    if (!this.isRunning) {
      this.isRunning = true;
      /** @type {number} */
      this.startTime = performance.now();
    }
 }

 stop() {
    if (this.isRunning) {
      this.isRunning = false;
      this.overallTime += this._getTimeElapsedSinceLastStart();
    }
 }

 reset() {
    this.overallTime = 0;
    /** @type {number} */
    this.startTime = this.isRunning ? performance.now() : 0;
 }

 /**
  * @returns {number}
  */
 getTime() {
    return this.startTime ? (this.isRunning ? this.overallTime + this._getTimeElapsedSinceLastStart() : this.overallTime) : 0;
 }

 /**
  * @param {number} timeToAdd
  */
 addTime(timeToAdd) {
    if (typeof timeToAdd === 'number') {
      this.overallTime += timeToAdd;
    }
 }

 /**
  * @param {number} timeToSubtract
  */
 subtractTime(timeToSubtract) {
    if (typeof timeToSubtract === 'number') {
      this.overallTime -= timeToSubtract;
    }
 }
}