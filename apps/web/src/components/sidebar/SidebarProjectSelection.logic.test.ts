import { describe, expect, it } from "vite-plus/test";

import {
  selectSidebarProjects,
  toggleSidebarProjectSelection,
} from "./SidebarProjectSelection.logic";

describe("selectSidebarProjects", () => {
  it("distinguishes all projects from an explicit empty selection", () => {
    const projects = [{ projectKey: "alpha" }, { projectKey: "beta" }];

    expect(selectSidebarProjects(projects, null)).toBe(projects);
    expect(selectSidebarProjects(projects, [])).toEqual([]);
  });

  it("keeps project order and objects when the selection has another order", () => {
    const alpha = Object.freeze({ projectKey: "alpha", title: "Alpha" });
    const beta = Object.freeze({ projectKey: "beta", title: "Beta" });
    const gamma = Object.freeze({ projectKey: "gamma", title: "Gamma" });
    const projects = Object.freeze([alpha, beta, gamma]);
    const selection = Object.freeze(["gamma", "offline", "alpha", "gamma"]);

    const selected = selectSidebarProjects(projects, selection);

    expect(selected).toEqual([alpha, gamma]);
    expect(selected[0]).toBe(alpha);
    expect(selected[1]).toBe(gamma);
    expect(projects).toEqual([alpha, beta, gamma]);
    expect(selection).toEqual(["gamma", "offline", "alpha", "gamma"]);
  });
});

describe("toggleSidebarProjectSelection", () => {
  it("lets two projects be selected independently from an empty selection", () => {
    const keys = ["alpha", "beta", "gamma"];
    const first = toggleSidebarProjectSelection([], keys, "alpha", true);
    const second = toggleSidebarProjectSelection(first, keys, "gamma", true);

    expect(first).toEqual(["alpha"]);
    expect(second).toEqual(["alpha", "gamma"]);
  });

  it("starts with every current project when deselecting from all projects", () => {
    expect(toggleSidebarProjectSelection(null, ["alpha", "beta", "gamma"], "beta", false)).toEqual([
      "alpha",
      "gamma",
    ]);
  });

  it("keeps an explicit selection when it includes every current project", () => {
    const selected = toggleSidebarProjectSelection(["alpha"], ["alpha", "beta"], "beta", true);

    expect(selected).toEqual(["alpha", "beta"]);
    expect(toggleSidebarProjectSelection(["alpha"], ["alpha"], "alpha", false)).toEqual([]);
  });

  it("preserves an offline selected project so it reappears after reconnecting", () => {
    const selection = ["alpha", "offline"];
    const updated = toggleSidebarProjectSelection(selection, ["alpha", "beta"], "beta", true);

    expect(updated).toEqual(["alpha", "offline", "beta"]);
    expect(
      selectSidebarProjects([{ projectKey: "alpha" }, { projectKey: "beta" }], updated),
    ).toEqual([{ projectKey: "alpha" }, { projectKey: "beta" }]);
    expect(
      selectSidebarProjects(
        [{ projectKey: "alpha" }, { projectKey: "beta" }, { projectKey: "offline" }],
        updated,
      ),
    ).toEqual([{ projectKey: "alpha" }, { projectKey: "beta" }, { projectKey: "offline" }]);
    expect(toggleSidebarProjectSelection(updated, ["alpha", "beta"], "alpha", false)).toEqual([
      "offline",
      "beta",
    ]);
  });

  it("deduplicates repeated toggles without mutating selection or available projects", () => {
    const selection = Object.freeze(["alpha", "offline", "alpha"]);
    const keys = Object.freeze(["alpha", "beta", "alpha"]);

    const checked = toggleSidebarProjectSelection(selection, keys, "alpha", true);

    expect(checked).toEqual(["alpha", "offline"]);
    expect(toggleSidebarProjectSelection(checked, keys, "beta", false)).toEqual(checked);
    expect(toggleSidebarProjectSelection(null, keys, "alpha", true)).toEqual(["alpha", "beta"]);
    expect(selection).toEqual(["alpha", "offline", "alpha"]);
    expect(keys).toEqual(["alpha", "beta", "alpha"]);
  });
});
