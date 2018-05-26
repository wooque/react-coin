import React from 'react';

export const handleResponse = (response) => {
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

export const ajax = (url) => {
  let req = new XMLHttpRequest();
  req.open('GET', url, true);

  let promise = new Promise((resolve, reject) => {
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          resolve(JSON.parse(req.responseText));
        }
    }
    req.onerror = function () {
      reject(JSON.parse(req.responseText));
    }
    req.send();
  });
  return {promise, req};
}