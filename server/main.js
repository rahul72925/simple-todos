import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../imports/db/TasksCollection";
import { ProjectsCollection } from "../imports/db/ProjectsCollection";
import { Accounts } from "meteor/accounts-base";
import "../imports/api/taskMethods";
import "../imports/api/tasksPublications";
import "../imports/api/projectMethods";
import "../imports/api/projectPublications";
import "../imports/api/taskWithProjectPublication";

const insertTask = async (taskText, user) => {
  await TasksCollection.insertAsync({
    text: taskText,
    createdAt: new Date(),
    userId: user._id,
  });
};

const insertProject = async (projectName, user) => {
  await ProjectsCollection.insertAsync({
    name: projectName,
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

  if ((await ProjectsCollection.find().countAsync()) === 0) {
    const projects = ["Project 1", "Project 2", "Project 3", "Project 4"];

    for (const eachProject of projects) {
      await insertProject(eachProject, user);
    }
  }
});
