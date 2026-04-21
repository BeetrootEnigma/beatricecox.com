"use client";

import { createContext, PropsWithChildren, use, useState } from "react";

import { ProjectCategory } from "@/types/global";

interface IProjectsFilterContext {
  currentFilter?: ProjectCategory;
  setCurrentFilter: (filter?: ProjectCategory) => void;
}

export const ProjectsFilterContext = createContext<IProjectsFilterContext>({
  currentFilter: undefined,
  setCurrentFilter: () => {},
});

export const useProjectsFilter = () => use(ProjectsFilterContext);

export const ProjectsFilterContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [currentFilter, setCurrentFilter] = useState<
    ProjectCategory | undefined
  >(undefined);

  const value = {
    currentFilter,
    setCurrentFilter,
  };

  return (
    <ProjectsFilterContext value={value}>{children}</ProjectsFilterContext>
  );
};
