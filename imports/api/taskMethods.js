import { check } from "meteor/check";
import { TasksCollection } from "../db/TasksCollection";
import { ProjectsCollection } from "../db/ProjectsCollection";

Meteor.methods({
  async "tasks.insert"(text, projectId) {
    check(text, String);
    check(projectId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    if (
      !(await ProjectsCollection.findOneAsync({
        _id: projectId,
        userId: this.userId,
      }))
    ) {
      throw new Meteor.Error("Invalid project");
    }

    await TasksCollection.insertAsync({
      text,
      createdAt: new Date(),
      userId: this.userId,
      projectId,
    });
  },
  async "tasks.remove"(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const task = TasksCollection.findOneAsync({
      _id: taskId,
      userId: this.userId,
    });

    if (!task) {
      throw new Meteor.Error("Not authorized.");
    }

    await TasksCollection.removeAsync(taskId);
  },
  async "tasks.setIsChecked"(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error("Not authorized.");
    }

    await TasksCollection.updateAsync(taskId, {
      $set: {
        isChecked,
      },
    });
  },
});
