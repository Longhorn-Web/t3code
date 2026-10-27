import { ChevronDownIcon, ListFilterIcon } from "lucide-react";
import { useState } from "react";

import type { SidebarProjectSnapshot } from "../../sidebarProjectGrouping";
import { ProjectFavicon } from "../ProjectFavicon";
import { Button } from "../ui/button";
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPopup,
  MenuSearchInput,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";
import {
  selectSidebarProjects,
  toggleSidebarProjectSelection,
  type SidebarProjectSelection,
} from "./SidebarProjectSelection.logic";

export function SidebarProjectPicker({
  projects,
  selection,
  onSelectionChange,
}: {
  projects: readonly SidebarProjectSnapshot[];
  selection: SidebarProjectSelection;
  onSelectionChange: (selection: SidebarProjectSelection) => void;
}) {
  const [query, setQuery] = useState("");
  const selectedCount = selectSidebarProjects(projects, selection).length;
  const matchingProjects = projects.filter((project) =>
    project.displayName.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const label = selection === null ? "All projects" : `${selectedCount} selected`;

  return (
    <Menu onOpenChange={() => setQuery("")}>
      <MenuTrigger
        render={<Button size="xs" variant="ghost-muted" />}
        aria-label={`Choose visible projects: ${label}`}
      >
        <ListFilterIcon aria-hidden />
        {label}
        <ChevronDownIcon aria-hidden />
      </MenuTrigger>
      <MenuPopup align="start" className="w-64">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Choose projects to keep in view.
        </div>
        <MenuSearchInput
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Find a project…"
          aria-label="Find a project"
        />
        <MenuCheckboxItem
          checked={selection === null}
          closeOnClick={false}
          onCheckedChange={(checked) => onSelectionChange(checked ? null : [])}
        >
          All projects
        </MenuCheckboxItem>
        <MenuItem closeOnClick={false} onClick={() => onSelectionChange([])}>
          Clear selection
        </MenuItem>
        <MenuSeparator />
        {matchingProjects.map((project) => (
          <MenuCheckboxItem
            key={project.projectKey}
            checked={selection === null || selection.includes(project.projectKey)}
            closeOnClick={false}
            onCheckedChange={(checked) =>
              onSelectionChange(
                toggleSidebarProjectSelection(
                  selection,
                  projects.map((candidate) => candidate.projectKey),
                  project.projectKey,
                  checked,
                ),
              )
            }
          >
            <span className="flex min-w-0 items-center gap-2">
              <ProjectFavicon project={project} />
              <span className="truncate">{project.displayName}</span>
            </span>
          </MenuCheckboxItem>
        ))}
        {matchingProjects.length === 0 ? <MenuItem disabled>No matching projects</MenuItem> : null}
      </MenuPopup>
    </Menu>
  );
}
