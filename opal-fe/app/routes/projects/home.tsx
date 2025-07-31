import type { Route } from "./+types/home"
import {ProjectDashboard} from "~/project/project";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Component() {
  return <ProjectDashboard />;
}
