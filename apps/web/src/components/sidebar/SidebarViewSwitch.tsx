import { FolderTreeIcon, InboxIcon } from "lucide-react";

import { updateClientSettings, useLegacySidebarEnabled } from "../../hooks/useSettings";
import { Toggle, ToggleGroup } from "../ui/toggle-group";

export function SidebarViewSwitch() {
  const projectsEnabled = useLegacySidebarEnabled();

  return (
    <div className="mb-2 px-1">
      <ToggleGroup
        aria-label="Sidebar view"
        className="w-full"
        value={[projectsEnabled ? "projects" : "inbox"]}
        onValueChange={(values) => {
          const view = values[0];
          if (view === undefined) return;
          updateClientSettings({ legacySidebarEnabled: view === "projects" });
        }}
      >
        <Toggle value="projects" className="flex-1">
          <FolderTreeIcon aria-hidden />
          Projects
        </Toggle>
        <Toggle value="inbox" className="flex-1">
          <InboxIcon aria-hidden />
          Inbox
        </Toggle>
      </ToggleGroup>
    </div>
  );
}
