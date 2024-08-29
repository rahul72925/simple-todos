import { Meteor } from "meteor/meteor";
import { Tamplate } from "meteor/templating";

import "./Task.html";
import { TasksCollection } from "../db/TasksCollection";

Template.task.events({
  "click .toggle-checked"() {
    Meteor.call("tasks.setIsChecked", this._id, !this.isChecked);
  },
  "click .delete"() {
    Meteor.call("tasks.remove", this._id);
  },
});
