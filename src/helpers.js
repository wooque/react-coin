import React from 'react';

export const handleResponse = (response) => {
  if (!response) {
    return;
  }
  return response.json()
    .then(json => {
      if (response.ok) {
        return json
      } else {
        return Promise.reject(json)
      }
    })
}

export const renderChangePercent = (changePercent) => {
  if (changePercent > 0) {
    return <span className="percent-raised">{changePercent}% &uarr;</span>
  } else if (changePercent < 0) {
    return <span className="percent-fallen">{changePercent}% &darr;</span>
  } else {
    return <span>{changePercent}</span>
  }
}

export class Debouncer {
  constructor(debounce) {
    this.debounce = debounce;
    this.execution = null;
    this.lastExecuted = null;
  }

  cancelExecution() {
    if (this.execution) {
      clearTimeout(this.execution);
    }
    this.execution = null;
    this.lastExecuted = null;
  }

  execute(func) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (that.execution) {
        return;
      }
      let execution = setTimeout(() => {
        that.cancelExecution();
        let promiseOrValue = func();
        if (promiseOrValue && typeof promiseOrValue.then === 'function') {
          that.lastExecuted = promiseOrValue;
          promiseOrValue.then((value) => {
            if (that.lastExecuted !== promiseOrValue) {
              return;
            }
            resolve(value);
          }).catch((e) => {
            reject(e);
          });
        } else {
          resolve(promiseOrValue);
        }
      }, that.debounce);
      that.execution = execution;
    })
  }
}
