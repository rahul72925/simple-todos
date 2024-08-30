import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../db/TasksCollection";
import { ProjectsCollection } from "../db/ProjectsCollection";

Meteor.publish("tasksWithProjects", async function () {
  // Publish tasks for the logged-in user
  const tasksCursor = TasksCollection.find({ userId: this.userId });

  // Collect project IDs from tasks
  const projectIds = (await tasksCursor.fetchAsync()).map(
    (task) => task.projectId
  );

  // Publish the related projects
  const projectsCursor = ProjectsCollection.find({ _id: { $in: projectIds } });

  // Return the cursors
  return [tasksCursor, projectsCursor];
});
