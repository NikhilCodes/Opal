import type {Route} from "../../.react-router/types/app/routes/+types";
import {Landing} from "~/landing/landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Opal" },
    { name: "description", content: "Best IAM-SSO Platform out there" },
  ];
}

export default function Component() {
  return <Landing/>;
}
