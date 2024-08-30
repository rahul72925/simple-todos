import React, { useState } from "react";

export const ProjectManager = () => {
  return (
    <div>
      <CreateProjectForm />
    </div>
  );
};

const CreateProjectForm = () => {
  const [project, setSetProject] = useState();

  const handleProjectSubmit = (event) => {
    event.preventDefault();

    Meteor.call("projects.insert", project);
  };
  return (
    <form className="project-form" onSubmit={handleProjectSubmit}>
      <input
        type="text"
        onChange={(e) => setSetProject(e.target.value)}
        placeholder="Type to add new project"
        value={project}
      />
      <button type="submit">Create Project</button>
    </form>
  );
};
