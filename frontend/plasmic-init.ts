import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
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
})