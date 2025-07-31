import type { Route } from "./+types/tabs"
import {IntegrationTab, RolesTab, SettingsTab, UsersTab} from "~/project/project";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Component(props: Route.ComponentProps) {
  switch (props.params.tabId) {
    case 'integration':
      return <IntegrationTab />
    case 'users':
      return <UsersTab id={props.params.pid} />
    case 'roles':
      return <RolesTab id={props.params.pid} />
    case 'settings':
      return <SettingsTab />
  }
}
