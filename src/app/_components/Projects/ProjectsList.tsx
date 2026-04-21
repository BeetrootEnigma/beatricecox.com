"use client";

import { use } from "react";

import { ProjectsFilterContext } from "@/contexts/ProjectsFilterContext";
import { Project as IProject } from "@/types/global";

import { filterProjects } from "./filterProjects";
import { Project } from "./Project";

interface ProjectsListProps {
  projects: Array<
    Pick<
      IProject,
      | "title"
      | "slug"
      | "intro"
      | "category"
      | "categoryText"
      | "thumbnailImage"
    >
  >;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const { currentFilter } = use(ProjectsFilterContext);

  const [leftColumnProjects, rightColumnProjects] = filterProjects({
    projects,
    currentFilter,
  });

  return (
    <div id="projects-container" className="bg-white">
      <div className="min-h-[90vh] container-x-padding py-12 lg:py-24 gap-x-20 flex flex-col md:flex-row md:justify-between">
        <div className="flex-1 flex flex-col mt-0">
          {leftColumnProjects.map((project) => (
            <Project key={project.slug} project={project} />
          ))}
        </div>

        <div className="flex-1 flex flex-col mt-20 lg:mt-12">
          {rightColumnProjects.map((project) => (
            <Project key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};
