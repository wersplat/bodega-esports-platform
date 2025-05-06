import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import MvpCard from "./components/MvpCard";
import SidebarLayoutWrapper from "./components/SidebarLayoutWrapper";
import TeamApprovalTable from "./components/TeamApprovalTable";
import WebhookManager from "./components/WebhookManager";
import LeagueSettingsForm from "./components/LeagueSettingsForm";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "jqYWxfABZytpGdnx7E7PAR",  // ID of a project you are using
      token: "ab2dy7cmRJ0TQzPbce2jkgrDVETsqqhwkNcbxYYxbDteiShCYLFxoHhsxjDKepRuqP31UAjvkLcBcTh2qBHdg"  // API token for that project
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
});

PLASMIC.registerComponent(MvpCard, {
  name: "MvpCard",
  props: {
    name: "string",
    team: "string",
    statLine: "string"
  },
});
PLASMIC.registerComponent(SidebarLayoutWrapper, {
  name: "SidebarLayoutWrapper",
  props: {
    children: "slot"
  }
});
PLASMIC.registerComponent(TeamApprovalTable, {
  name: "TeamApprovalTable",
  props: {}
});

PLASMIC.registerComponent(WebhookManager, {
  name: "WebhookManager",
  props: {}
});

PLASMIC.registerComponent(LeagueSettingsForm, {
  name: "LeagueSettingsForm",
  props: {}
});