import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { expect } from "chai";
var jsdom = require("mocha-jsdom");

// global.document = jsdom({
//   url: "http://localhost:3000/"
// });

import Overview from './overview';

// let rootContainer;

// beforeEach(() => {
//   rootContainer = document.createElement("div");
//   document.body.appendChild(rootContainer);
// });

// afterEach(() => {
//   document.body.removeChild(rootContainer);
//   rootContainer = null;
// });
const objFormat = {ServiceProvider: "", Frequency: "", Source: "", SourceType: "", ProvidesRevenueReport: 1}; 

describe("Overview Component Testing", () => {
  it("Retrieves data from API", () => {
    act(() => {
      this.getData();
    });
    // expect(responseObj).to.equal(objFormat);

    
  });
});