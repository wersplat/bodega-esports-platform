# CHANGELOG

## [v1.1.0](https://github.com/wersplat/bodega-esports-platform/releases/tag/v1.1.0) - 2025-04-27 01:03:16

[v1.1.0]

Added separate Frontend and Backend GitHub Actions workflows.

Added dynamic badges for CI status.

Improved mono-repo safety for independent frontend/backend deployment.

**Full Changelog**: https://github.com/wersplat/bodega-esports-platform/compare/v1.0...v1.1.0

### Features

- general:
  - Update App component to use theme.css and enhance Login component with autoComplete attribute ([0399840](https://github.com/wersplat/bodega-esports-platform/commit/03998405c72143d7990034cac7588c9d482afd0d))
  - Add .htaccess for routing, update API calls to use base URL, and improve project structure ([283e69f](https://github.com/wersplat/bodega-esports-platform/commit/283e69fc46b8a48aaad229f7be9f271ef83a916f))
  - Add Send Announcement page for Discord integration ([ba149dc](https://github.com/wersplat/bodega-esports-platform/commit/ba149dceae1ad8efa8e75f7be7c08f0c43cb60cf))
  - Enhance meta router with pagination and query parameters for seasons, teams, and divisions ([9e2b24d](https://github.com/wersplat/bodega-esports-platform/commit/9e2b24d1bc9b4edcfbd0cea4693b891dc3e900c8))
  - Implement API endpoints for Discord notifications and enhance router structure ([22e2464](https://github.com/wersplat/bodega-esports-platform/commit/22e2464f46b6bd50d37db7ba7a0f69f84f825125))
  - Add Discord router for announcements and notifications ([c672992](https://github.com/wersplat/bodega-esports-platform/commit/c67299256b56d1961bcb41a4ea2787b3348382c5))
  - Add exports and meta routers; integrate Vercel Speed Insights in App component ([b8bc95d](https://github.com/wersplat/bodega-esports-platform/commit/b8bc95d7cb7fe60f6e171ee7a42d845aa37bdc16))
  - Add webhooks API and integrate season selection in admin forms ([6d934e8](https://github.com/wersplat/bodega-esports-platform/commit/6d934e8ba55f0ca214a7e06c8fa63315c3a3ae06))
  - Enhance leaderboard functionality with match data integration and improve error handling in API calls ([5a2277f](https://github.com/wersplat/bodega-esports-platform/commit/5a2277f8212fc560f176aed88840b3bc9ad43714))
  - Implement player management and enhance leaderboard functionality; add comprehensive documentation ([da5979c](https://github.com/wersplat/bodega-esports-platform/commit/da5979cc82773b3b058040e23a85b3c0f56912e0))
  - Integrate Discord announcement feature and add scheduled exports to Google Sheets ([bb7ce6b](https://github.com/wersplat/bodega-esports-platform/commit/bb7ce6b7bc81a5982a516086e6fba071ea84f85b))
  - Always render Navbar in App component and refactor Leaderboard to remove divisions state and related logic ([4632fa8](https://github.com/wersplat/bodega-esports-platform/commit/4632fa8226990ce68c2fc18b34226d0267a983db))
  - Add stats charts API and integrate TopScorersChart component in Leaderboard ([20c79cc](https://github.com/wersplat/bodega-esports-platform/commit/20c79cc96b5bd38b66f1a41bd7c1daafc6569f00))
  - Add axios for API calls and refactor Leaderboard component ([beae173](https://github.com/wersplat/bodega-esports-platform/commit/beae173578022825e70176e98526b067e11a2ebf))
  - Add players router with create and retrieve functionality ([ba71fb8](https://github.com/wersplat/bodega-esports-platform/commit/ba71fb888b19da82f28b8d645ebf74dd59256129))
  - Implement teams router with create and retrieve functionality ([353638d](https://github.com/wersplat/bodega-esports-platform/commit/353638ddd8a1cd66f8de901f6bc11dacb8255087))
  - Enhance Navbar with user authentication and notifications support ([b12d606](https://github.com/wersplat/bodega-esports-platform/commit/b12d6063c72057727d1a79abdcbc07a6fada8764))
  - Update dependencies and enhance Navbar with mobile menu support ([edf355f](https://github.com/wersplat/bodega-esports-platform/commit/edf355fa5f04b332bdd0686d8e5c803145353c3a))
  - Add Admin Review Board component for managing match submissions ([0ebfb34](https://github.com/wersplat/bodega-esports-platform/commit/0ebfb3442cac922197963b08915f2c9c9888f5c5))
  - Refactor AdminManageWebhooks and SendAnnouncement components for improved user experience and functionality ([7b17244](https://github.com/wersplat/bodega-esports-platform/commit/7b172444994ac42174d4fbae6115c5d89d55d328))
  - Add NotificationsBell component for real-time notifications and toast alerts ([b6ba5ab](https://github.com/wersplat/bodega-esports-platform/commit/b6ba5abccb794768cd8da444de77c0f96f1fc955))
  - Enhance Admin Dashboard with new match management features ([5860359](https://github.com/wersplat/bodega-esports-platform/commit/5860359c3878ed4c7308bafa892ec365cb08f747))

### Bug Fixes

- general:
  - Add .env.production file with VITE_API_BASE_URL configuration ([165a341](https://github.com/wersplat/bodega-esports-platform/commit/165a341315f4d8e49423081953525e3c57f7dad8))
  - Add python-multipart to requirements.txt ([57227bd](https://github.com/wersplat/bodega-esports-platform/commit/57227bd5cd9194b5ad8c6a75708249a1b5b00fa7))
  - Define PlayerStat model and establish relationship with Player ([ffbf849](https://github.com/wersplat/bodega-esports-platform/commit/ffbf8491096cbf9f0f4cb536d3196fa7f9e973aa))
  - Define Division and Conference models with relationships to Season and Match ([7ee93c4](https://github.com/wersplat/bodega-esports-platform/commit/7ee93c469f24b8ef96f01aac32b9aee824292533))
  - Define Season model and establish relationship with League ([e398ff9](https://github.com/wersplat/bodega-esports-platform/commit/e398ff90a502a790b49165a235624bd469217f47))
  - Define Player model and establish relationship with Team ([fa9e730](https://github.com/wersplat/bodega-esports-platform/commit/fa9e7301cbdbf5c8b55e77a467eafeaaea7e78f2))
  - Update uvicorn command in start.sh to correct module path ([daced9a](https://github.com/wersplat/bodega-esports-platform/commit/daced9accad0d3f0e1d9b13423aeaf02a73d9768))
  - Update import paths in models.py and test_db.py for consistency ([c64ef04](https://github.com/wersplat/bodega-esports-platform/commit/c64ef04218b6f0fa9220952f01227fdfc72ccde6))
  - Add start.sh script for running FastAPI application ([c7e7d2f](https://github.com/wersplat/bodega-esports-platform/commit/c7e7d2f4f431568742955d1e952c882b89aa0c9b))
  - Restore index.html file for frontend application ([85b976d](https://github.com/wersplat/bodega-esports-platform/commit/85b976dc76a4646b443b8b84c79ed2515375c8ef))
  - Remove redundant comment in vite.config.js for clarity ([47708f1](https://github.com/wersplat/bodega-esports-platform/commit/47708f112f8e88ecaaa011a7396e61eea0d2aab7))
  - Update frontend build command to use Vite in start.sh ([1cf7749](https://github.com/wersplat/bodega-esports-platform/commit/1cf774957d9453307d31fa28626f9e6a96715556))
  - Rearrange start.sh to ensure proper backend execution after frontend build ([0d229c0](https://github.com/wersplat/bodega-esports-platform/commit/0d229c03417f85564aab92ba08b9d3bc0512933c))
  - Add configuration for bodega-esports-frontend service in render.yaml ([4adec07](https://github.com/wersplat/bodega-esports-platform/commit/4adec07cccd570ea4888e420d61df3ed5fb727ca))
  - Update requirements.txt to remove python-multipart ([c999d23](https://github.com/wersplat/bodega-esports-platform/commit/c999d236187f199fcb3daf72989fd95f6758cb3f))
  - Update requirements.txt to replace python-multipart with uvicorn ([f545d40](https://github.com/wersplat/bodega-esports-platform/commit/f545d40129d9bcc3791c58d2e6f36f221ae8967b))
  - Clean up requirements.txt by removing unused dependencies ([9945102](https://github.com/wersplat/bodega-esports-platform/commit/9945102843df747cb91d3591b9acfb0f7bc2b67a))
  - Remove unused SpeedInsights import from App.jsx ([0003dae](https://github.com/wersplat/bodega-esports-platform/commit/0003dae3bd6b101bef2e944277b28ed5181ea122))
  - Correct import path for AppWrapper in Main.jsx ([36133f5](https://github.com/wersplat/bodega-esports-platform/commit/36133f51a87d95d1514f58215fbddfffdf713193))
  - Add rollup-plugin-visualizer to package.json and remove from requirements.txt ([0245b1b](https://github.com/wersplat/bodega-esports-platform/commit/0245b1bdfed6833ec83ed3bb045edf0de4798eda))
  - Add rollup-plugin-visualizer to requirements for improved build visualization ([760f86d](https://github.com/wersplat/bodega-esports-platform/commit/760f86df69e94d169ee76e181766d72ef33384f5))
  - Remove unused Dockerfile and docker-compose files, and clean up package dependencies ([9be7d70](https://github.com/wersplat/bodega-esports-platform/commit/9be7d70ae0342621a1a981be5a37e31307ba47c8))
  - Update PYTHONPATH in start.sh to include backend directory for correct module resolution ([c3f0564](https://github.com/wersplat/bodega-esports-platform/commit/c3f056436cfd60344f6c2c50acb08645329659f1))
  - Update Python path configuration by removing workspace root and ensuring backend directory is correctly added ([8319bcb](https://github.com/wersplat/bodega-esports-platform/commit/8319bcb78a35e1f10d6cc4d0397a3816f0ebefba))
  - Enhance start.sh by adding error handling and dynamic port configuration ([2768c60](https://github.com/wersplat/bodega-esports-platform/commit/2768c60ad659d94b16e4fe49f4eb9514984989cb))
  - Reorganize requirements.txt by removing commented packages and ensuring oauth2client is included ([4c3723a](https://github.com/wersplat/bodega-esports-platform/commit/4c3723a0105e6f4fbee44a764ac7bcab526c9e25))
  - Update region to Virginia in render.yaml and ensure OCR directory is ignored in build filters ([102ff1f](https://github.com/wersplat/bodega-esports-platform/commit/102ff1f1e2420cde866c209337ef62d22e4230e5))
  - Correct import paths and streamline router inclusions in main.py for improved structure ([02fcbae](https://github.com/wersplat/bodega-esports-platform/commit/02fcbae0385bd1eb0ec1c10a70a5d3b2455f4014))
  - Correct import paths in main.py and update rootDir in render.yaml to deploy from repo root ([78449e3](https://github.com/wersplat/bodega-esports-platform/commit/78449e3063e15e1a49569ad9b88697309b2d187a))
  - Update .gitignore to include OCR directory and requirements.txt; remove obsolete requirements.txt file; refine start.sh for correct app path ([25b5668](https://github.com/wersplat/bodega-esports-platform/commit/25b56682fd0098b67ffea37e090ddebd6b23d027))
  - Update rootDir comment in render.yaml for clarity; clean up requirements.txt by removing duplicates and commented packages ([e1f5b5a](https://github.com/wersplat/bodega-esports-platform/commit/e1f5b5a7438eb5152bbc1d42ba565e8fcbea9854))
  - Update root directory to repo root and modify build command in render.yaml; enhance start.sh to set PORT variable ([62dfe3e](https://github.com/wersplat/bodega-esports-platform/commit/62dfe3ec851d0d90a58d336314cc4e60f8390df1))
  - Correct import path for the Discord router ([6ba1c91](https://github.com/wersplat/bodega-esports-platform/commit/6ba1c9155d26517951d48cbf8e1e3f6495d6df60))
  - Correct import paths for exports and meta routers ([860581f](https://github.com/wersplat/bodega-esports-platform/commit/860581f6a800e7967dfb04b55ee71e0e20ab1bc9))

### Refactors

- general:
  - Update leaderboard and schema classes for improved readability and consistency ([f91a3e5](https://github.com/wersplat/bodega-esports-platform/commit/f91a3e5cd6927b76907e028d8bb2fe1cb4b11b85))
  - Update API endpoints for divisions and teams to standardize routes and improve readability ([dfb838c](https://github.com/wersplat/bodega-esports-platform/commit/dfb838c10798c1b26de55d7c3cc685fe8d1e41a0))
  - Remove unused player and team route implementations ([0464396](https://github.com/wersplat/bodega-esports-platform/commit/0464396944afdb77d00f060cfed198cf51ab1a31))

###  chores

- general:
  - Update .gitignore to exclude OCR directory; refine Vite config comments for clarity ([e218fef](https://github.com/wersplat/bodega-esports-platform/commit/e218fefabd19bf3cf59681d6f54d0c6391d878b4))
  - Remove duplicate entries in requirements.txt ([e732ebc](https://github.com/wersplat/bodega-esports-platform/commit/e732ebc85e69e5ce6791bdb558d52859d2e396ee))
  - Consolidate and update dependencies in requirements.txt ([ba2c3d3](https://github.com/wersplat/bodega-esports-platform/commit/ba2c3d3b39fea51d38073971aacd19ed5b3a749b))
  - Add missing dependencies to requirements.txt for gspread, oauth2client, pandas, and axios ([04d1a9a](https://github.com/wersplat/bodega-esports-platform/commit/04d1a9a230f867b0aed72fb71aa5393c742004b1))

## [v1.0](https://github.com/wersplat/bodega-esports-platform/releases/tag/v1.0) - 2025-04-21 19:37:43

- Admin Dashboard
- Dynamic Theme Routing
- League Creation and Locking
- Team Management
- Bracket Generator
- Full Frontend-Backend Secure
- Public + Alt Theme Live

\* *This CHANGELOG was automatically generated by [auto-generate-changelog](https://github.com/BobAnkh/auto-generate-changelog)*
