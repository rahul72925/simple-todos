import { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { ProjectsCollection } from "../db/ProjectsCollection";

export const GroupByProjectTasks = () => {
  const tasks = useTracker(() => TasksCollection.find({}).fetch());
  const projects = useTracker(() => ProjectsCollection.find({}.fetch()));

  const [groupByProjectTasks, setGroupByProjectTasks] = useState(null);
  const [status, setStatus] = useState("LOADING");

  useEffect(() => {
    const projectIdsObj = {};

    projects.forEach((eachProject) => {
      projectIdsObj[eachProject._id] = { ...eachProject, tasks: [] };
    });
    tasks.forEach((eachTask) => {
      projectIdsObj[eachTask.projectId]["task"].push(eachTask);
    });

    setGroupByProjectTasks(Object.values(projectIdsObj) || []);
    setStatus("SUCCESS");
  }, [tasks, projects]);

  if (status === "LOADING") {
    return <div>Loading</div>;
  }

  if (groupByProjectTasks.length === 0) {
    return <div>No Task Avaiable</div>;
  }

  const handleTaskRemove = (_id) => {
    Meteor.call("tasks.remove", _id);
  };

  const handleStatusChange = (_id, isChecked) => {
    Meteor.call("tasks.setIsChecked", _id, isChecked);
  };

  return (
    <div>
      {groupByProjectTasks.map((eachProject) => (
        <div key={eachProject._id}>
          <p>{eachProject.name}</p>
          <ul>
            {eachProject.tasks.map(({ _id, text, isChecked }) => (
              <li key={_id}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  className="toggle-checked"
                  onClick={() => {
                    handleStatusChange(_id, !isChecked);
                  }}
                />
                <span>{{ text }}</span>
                <button
                  className="delete"
                  onClick={() => handleTaskRemove(_id)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
