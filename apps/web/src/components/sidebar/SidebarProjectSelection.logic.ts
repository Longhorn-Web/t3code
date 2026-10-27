export type SidebarProjectSelection = readonly string[] | null;

export function selectSidebarProjects<T extends { readonly projectKey: string }>(
  projects: readonly T[],
  selection: SidebarProjectSelection,
): readonly T[] {
  if (selection === null) return projects;
  const selected = new Set(selection);
  return projects.filter((project) => selected.has(project.projectKey));
}

export function toggleSidebarProjectSelection(
  selection: SidebarProjectSelection,
  allProjectKeys: readonly string[],
  projectKey: string,
  checked: boolean,
): SidebarProjectSelection {
  const selected = new Set(selection ?? allProjectKeys);
  if (checked) selected.add(projectKey);
  else selected.delete(projectKey);
  return [...selected];
}
