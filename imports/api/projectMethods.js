import { check } from "meteor/check";
import { ProjectsCollection } from "../db/ProjectsCollection";

Meteor.methods({
  async "projects.insert"(text) {
    check(text, String);
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    await ProjectsCollection.insertAsync({
      name: text,
      createdAt: new Date(),
      userId: this.userId,
    });
  },
});
