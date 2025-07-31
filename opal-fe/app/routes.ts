import {type RouteConfig, index, route, prefix} from "@react-router/dev/routes";

export default [
  ...prefix("projects", [
    index("./routes/projects/home.tsx"),
    route(":pid", "./routes/projects/project/project.tsx", [
      route(":tabId","./routes/projects/project/tabs.tsx"),
    ])
  ]),
  index("./routes/index.tsx"),
] satisfies RouteConfig;
