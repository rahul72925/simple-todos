import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../imports/db/TasksCollection";
import { Accounts } from "meteor/accounts-base";
import "../imports/api/taskMethods"
import "../imports/api/tasksPublications"

const insertTask = async (taskText, user) => {
  await TasksCollection.insertAsync({
    text: taskText,
    createdAt: new Date(),
    userId: user._id,
  });
};

const SEED_USERNAME = "meteorite";
const SEED_PASSWORD = "password";

Meteor.startup(async () => {
  if (!(await Accounts.findUserByUsername(SEED_USERNAME))) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  const user = await Accounts.findUserByUsername(SEED_USERNAME);

  if ((await TasksCollection.find().countAsync()) === 0) {
    const tasks = [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ];

    for (const task of tasks) {
      await insertTask(task, user);
    }
  }
});
