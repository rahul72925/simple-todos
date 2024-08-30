import { Template } from "meteor/templating";
import { TasksCollection } from "../db/TasksCollection.js";
import { ReactiveDict } from "meteor/reactive-dict";

import "./App.html";
import "./Task.js";
import "./Login.js";
import { ProjectsCollection } from "../db/ProjectsCollection.js";
import { ProjectManager } from "./ProjectManager.jsx";
import { createRoot } from "react-dom/client";
import { GroupByProjectTasks } from "./GroupByProjectTasks.jsx";

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

const IS_LOADING_STRING = "isLoading";

const HIDE_COMPLETED_STRING = "hideCompleted";

const SHOW_GROUOP_BY_PROJECT_TASKS = false;

const getTasksFilter = () => {
  const user = getUser();

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  return { userFilter, pendingOnlyFilter };
};

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();

  const taskHandler = Meteor.subscribe("tasks");
  const projectHandler = Meteor.subscribe("projects");
  const tasksWithProjectsHandler = Meteor.subscribe("tasksWithProjects");

  Tracker.autorun(() => {
    this.state.set(
      IS_LOADING_STRING,
      !(
        taskHandler.ready() &&
        projectHandler.ready() &&
        tasksWithProjectsHandler.ready()
      )
    );
  });
});

Template.mainContainer.helpers({
  tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) {
      return [];
    }

    return TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
  },
  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },
  incompleteCount() {
    if (!isUserLogged()) {
      return "";
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount =
      TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : "";
  },
  isUserLogged() {
    return isUserLogged();
  },
  getUser() {
    return getUser();
  },
  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  },
  tasksWithProjects() {
    const { pendingOnlyFilter, userFilter } = getTasksFilter();
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    if (!isUserLogged()) {
      return [];
    }

    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter
    ).fetch();

    return tasks.map((task) => {
      const project = ProjectsCollection.findOne(task.projectId);
      return {
        ...task,
        projectName: project ? project.name : "Unknown Project",
      };
    });
  },
  showGroupByProjectTasks() {
    return Template.instance().state.get(SHOW_GROUOP_BY_PROJECT_TASKS);
  },
});

Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },
  "click .user"() {
    Meteor.logout();
  },
  "click #show-group-by-project-task"(e, instance) {
    const currentShowGroupByProjectTasks = instance.state.get(
      SHOW_GROUOP_BY_PROJECT_TASKS
    );
    instance.state.set(
      SHOW_GROUOP_BY_PROJECT_TASKS,
      !currentShowGroupByProjectTasks
    );
  },
});

Template.projects.onRendered(function () {
  // Mount the React component into the Blaze template
  Meteor.defer(() => {
    const container = document.getElementById("project-container");

    if (container) {
      const root = createRoot(container);
      root.render(<ProjectManager />);
    } else {
      console.error("Target container is not a DOM element.");
    }
  });
});

Template.form.events({
  "submit .task-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const projectId = target.project.value;

    // Insert a task into the collection
    Meteor.call("tasks.insert", text, projectId);

    // Clear form
    target.text.value = "";
    target.project.value = null;
  },
});

Template.form.helpers({
  projects() {
    const user = getUser();

    return ProjectsCollection.find(
      { userId: user._id },
      { sort: { createdAt: -1 } }
    ).fetch();
  },
});

Template.groupByProjectTasks.onRendered(function () {
  // Mount the React component into the Blaze template
  Meteor.defer(() => {
    const container = document.getElementById("group-by-project-tasks");

    if (container) {
      const root = createRoot(container);
      root.render(<GroupByProjectTasks />);
    } else {
      console.error("Target container is not a DOM element.");
    }
  });
});
