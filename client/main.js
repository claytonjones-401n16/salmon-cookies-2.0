import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import "./main.html";

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  "click .button-to-click"(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.table.onCreated(function tableCreated() {
  this.stores = new ReactiveVar([]);
  this.grandTotal = new ReactiveVar(0);
  this.allStoreHourlyTotals = new ReactiveVar([]);

  let locationData = [
    { name: "Seattle", minCust: 23, maxCust: 65, avgSold: 6.3 },
    { name: "Tokyo", minCust: 5, maxCust: 16, avgSold: 1.2 },
    { name: "Dubai", minCust: 11, maxCust: 38, avgSold: 3.7 },
    { name: "Paris", minCust: 20, maxCust: 38, avgSold: 2.3 },
    { name: "Lima", minCust: 2, maxCust: 16, avgSold: 4.7 },
  ];

  let allHourlyTotals = [];
  let grandTotal = Template.instance().grandTotal;

  for (let i = 0; i < 14; i++) {
    allHourlyTotals[i] = { total: 0 };
  }

  locationData.forEach((location) => {
    let hourTotals = [];
    let dailyTotal = 0;
    const { name, minCust, maxCust, avgSold } = location;

    for (let i = 0; i < 14; i++) {
      let oneHourTotal = Math.floor(
        (Math.floor(Math.random() * (maxCust + 1 - minCust)) + minCust) *
          avgSold
      );
      hourTotals.push({ total: oneHourTotal });
      dailyTotal += oneHourTotal;
      allHourlyTotals[i] = { total: allHourlyTotals[i].total + oneHourTotal };
    }

    grandTotal.set(grandTotal.get() + dailyTotal);

    Template.instance().stores.set([
      ...Template.instance().stores.get(),
      { name, hourTotals, dailyTotal },
    ]);
  });

  Template.instance().allStoreHourlyTotals.set([...allHourlyTotals]);
});

Template.table.helpers({
  th: [
    "6am",
    "7am",
    "8am",
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
  ],
  stores() {
    return Template.instance().stores.get();
  },
  allTotals() {
    return Template.instance().allStoreHourlyTotals.get();
  },
  grandTotal() {
    return Template.instance().grandTotal.get();
  },
});
