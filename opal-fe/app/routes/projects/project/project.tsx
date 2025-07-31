import type { Route } from "./+types/project"
import {ProjectById, ProjectDashboard} from "~/project/project";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Component(props: Route.ComponentProps) {
  return <ProjectById id={props.params.pid}/>;
}
