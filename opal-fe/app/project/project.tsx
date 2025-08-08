import React, {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  ActionIcon,
  Button,
  Card,
  Code,
  CopyButton, Grid,
  Group,
  Modal,
  MultiSelect,
  Paper,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {api} from "~/api";
import {Outlet, useNavigate, useOutletContext, useParams} from "react-router";
import {IconBox, IconCheck, IconCopy, IconCpu, IconHome, IconPlus, IconTrash, IconUsersGroup} from '@tabler/icons-react';
import {useEnvironment} from "~/hooks/states";
import type {Role} from "~/types/role";
import {formatDate} from "~/utils/datetime";
import NoDataPlaceholder from "~/components/no-data";

type Project = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export function ProjectDashboard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalOpened, setModalOpened] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.get("/api/project").then((res) => res.data),
  });

  const createProjectMutation = useMutation({
    mutationFn: (newProject: { name: string; description: string }) =>
      api.post("/api/project", newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["projects"]});
      setName("");
      setDescription("");
      setModalOpened(false);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/project/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["projects"]});
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({name, description});
  };

  const handleDelete = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  if (isLoading) {
    return <Text>Loading projects...</Text>;
  }

  if (error) {
    return <Text color="red">Error loading projects</Text>;
  }

  return (
    <main className="flex items-center justify-center pt-8 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        {/* Modal for creating a new project */}
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title="Create New Project"
        >
          <form onSubmit={handleCreate}>
            <Stack gap="sm">
              <TextInput
                label="Project Name"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
              />
              <Textarea
                label="Description"
                placeholder="Enter project description"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
              />
              <Button type="submit"> <IconPlus size={18}/>&nbsp;Create Project</Button>
            </Stack>
          </form>
        </Modal>

        <Paper p="md" radius="md" className={'w-full'}>
          <Stack gap="md" className="px-4">
            <Group mb="md" justify={'space-between'}>
              <Title order={2} className={'flex items-center gap-2'}>
                <IconHome/>
                Projects
              </Title>
              <Button color={"teal"} onClick={() => setModalOpened(true)}> <IconPlus size={18}/>&nbsp;New
                Project</Button>
            </Group>
            <Grid>
              {projects.length > 0 ? projects.map((project) => (
                <Grid.Col span={3} key={project.id} w={350}>
                  <Card
                    key={project.id}
                    shadow="sm"
                    w={350}
                    withBorder
                    className={'cursor-pointer'}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <Group align="start">
                      <div>
                        <strong>{project.name}</strong>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {project.description || "No description provided."}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                </Grid.Col>
              )) : <NoDataPlaceholder />}
            </Grid>
          </Stack>
        </Paper>
      </div>
    </main>
  );
}

export function ProjectById({id}: { id: string }) {
  const {
    data,
    isLoading,
    error,
  } = useQuery<Project>({
    queryKey: ["projects", id],
    queryFn: () => api.get(`/api/project/${id}`).then((res) => res.data),
  });
  const navigate = useNavigate();
  const {tabId} = useParams();

  const {env, setEnv} = useEnvironment();
  useEffect(() => {
    if (tabId == null) {
      navigate("integration", {
        replace: true
      })
    }
  }, []);
  if (isLoading) {
    return <Text>Loading project...</Text>;
  }

  if (error || !data) {
    return <Text className="text-red-500">Error loading project</Text>;
  }

  return (
    <Paper shadow="none" p="xl" radius="md">
      <Stack gap="md">
        <Group justify={'space-between'} align="baseline">
          <Group align={'center'} gap={'lg'}>
            <Title order={2} className={'flex gap-1 items-center'}><IconBox/>{data.name}</Title>
            {/*<Select*/}
            {/*  placeholder={"Environment"}*/}
            {/*  defaultValue={"prod"}*/}
            {/*  size={"xs"}*/}
            {/*  value={env}*/}
            {/*  onChange={v => setEnv(v || 'prod')}*/}
            {/*  data={[*/}
            {/*    {value: 'prod', label: 'PROD'},*/}
            {/*    {value: 'staging', label: 'STAGING'},*/}
            {/*    {value: 'dev', label: 'DEV'},*/}
            {/*  ]}*/}
            {/*/>*/}
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Project ID:
            </Text>
            <Code>{id}</Code>
            <CopyButton value={id} timeout={1500}>
              {({copied, copy}) => (
                <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                  <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                    {copied ? <IconCheck size="1rem"/> : <IconCopy size="1rem"/>}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        </Group>
        <Title order={6} h={7}>About the project</Title>
        <Text c={'dimmed'} size={'sm'}>{data.description || "No description provided."}</Text>
        <Tabs
          defaultValue="integration"
          value={tabId}
          onChange={(value) => navigate(`/projects/${id}/${value}`, {replace: true})}
        >
          <Tabs.List>
            <Tabs.Tab value="integration">Integration</Tabs.Tab>
            <Tabs.Tab value="users">Users</Tabs.Tab>
            <Tabs.Tab value="roles">Roles</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>

          <Outlet context={{project: data}}/>
        </Tabs>
      </Stack>
    </Paper>
  );
}

export function IntegrationTab() {
  const context: { project: { secret_key: string } } = useOutletContext();
  const apiKey = `sk_${context.project.secret_key}`
  return (
    <Paper p="md" radius="md">
      <Stack gap="sm">
        <Title order={4}>Install via NPM</Title>
        <Code block>npm install @getopal/sdk</Code>

        <Title order={4} mt="md">Usage Example</Title>
        <Code block>{`import { Opal } from "@getopal/sdk";
 
const client = new Opal({
  apiKey: "${apiKey}",
  apiUrl: "http://localhost:8080/api",
});
 
client.authenticate("user@example.com", "password123", "email-password").then((session) => {
  console.log("Authenticated:", session);
});`}</Code>

        <Title order={4} mt="md">API Key</Title>
        <Text size="sm">Use the following API key in your integration:</Text>
        <Code>{apiKey}</Code>
      </Stack>
    </Paper>
  );
}

export function UsersTab({id}: { id: string }) {
  const {env} = useEnvironment()
  const [visibleCreateUserModal, setVisibleCreateUserModal] = useState(false);
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project", id, "users", env],
    queryFn: () => api.get(`/api/project/${id}/user`, {
      headers: {
        'X-Environment': env,
      }
    }).then((res) => res.data),
  });
  const {
    data: roles = [],
    isLoading: isRolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ["project", id, "roles", env],
    queryFn: () => api.get(`/api/project/${id}/role`, {
      headers: {
        'X-Environment': env
      }
    }).then((res) => res.data),
  });

  if (isLoading) {
    return <Text>Loading users...</Text>;
  }

  if (isRolesLoading) {
    return <Text>Loading roles...</Text>;
  }

  if (rolesError) {
    return <Text className={'text-red-500'}>Error loading roles</Text>;
  }

  if (error) {
    return <Text className={'text-red-500'}>Error loading users</Text>;
  }

  const tableData = {
    head: ["Name", "User ID", "Email", "Phone", "Enabled", "Role", "Actions"],
    body: data.map((user: any) => [
      user.name,
      user.username,
      user.email,
      user.phone,
      user.is_enabled ? "Yes" : "No",
      Array.isArray(user.roles) ? user.roles.map((r: any) => r.name).join(", ") : "-",
      <ActionIcon
        key={user.id}
        color="red"
        variant="subtle"
        onClick={() => handleDeleteUser(user.id)}
        size="sm"
      >
        <IconTrash size={16} />
      </ActionIcon>
    ]),
  };

  const onCreate = async (newUser: Record<string, any>) => {
    const res = await api.post(`/api/project/${id}/user`, newUser, {
      headers: {
        'X-Environment': env
      }
    });
    return res.data;
  }

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.delete(`/api/project/${id}/user/${userId}`, {
      headers: {
        'X-Environment': env
      }
    }),
    onSuccess: () => {
      refetch();
    },
  });

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <Paper p="md" radius="md">
      <Stack gap="sm">
        <Group justify={'space-between'} align="baseline">
          <Title order={4}>Users</Title>
          <Button color={'teal'} onClick={() => setVisibleCreateUserModal(true)}>
            <IconPlus size={18}/>&nbsp;Create User
          </Button>
          <CreateModal
            onCreate={(data) => {
              if (data.user_roles.length !== 0) {
                const roleIds = data.user_roles.split(",")
                data.user_roles = roleIds.map((roleId: string) => ({
                  role_id: roleId.trim(),
                  project_id: id,
                }));
              } else {
                data.user_roles = [];
              }
              onCreate(data).then((res) => {
                refetch().then()
                return res
              })
            }}
            opened={visibleCreateUserModal}
            onClose={() => setVisibleCreateUserModal(false)}
            formConfig={{
              fields: [
                {
                  name: "name",
                  label: "Name",
                  type: "text",
                  required: true,
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  required: true,
                },
                {
                  name: "phone",
                  label: "Phone",
                  type: "text",
                },
                {
                  name: "user_roles",
                  label: "Roles",
                  type: "multi_select",
                  options: roles.map((role: Role) => ({value: role.id, label: role.name})),
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  required: true,
                }
              ],
              submitLabel: "Create User",
              title: "Create New User",
            }}
          />
        </Group>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          data={tableData}
        />
      </Stack>
    </Paper>
  );
}

export function RolesTab({id}: { id: string }) {
  const {env} = useEnvironment()
  const [visibleCreateRoleModal, setVisibleCreateRoleModal] = useState(false);
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["project", id, "roles", env],
    queryFn: () => api.get(`/api/project/${id}/role`, {
      headers: {
        'X-Environment': env
      }
    }).then((res) => res.data),
  });
  if (isLoading) {
    return <Text>Loading roles...</Text>;
  }

  if (error) {
    return <Text className={'text-red-500'}>Error loading roles</Text>;
  }

  const tableData = {
    head: ["Role", "Enabled", "Actions"],
    body: data.map((role: any) => [
      role.name,
      role.is_enabled ? "Yes" : "No",
      <ActionIcon
        key={role.id}
        color="red"
        variant="subtle"
        onClick={() => handleDeleteRole(role.id)}
        size="sm"
      >
        <IconTrash size={16} />
      </ActionIcon>
    ]),
  };

  const onCreate = async (newRole: Record<string, any>) => {
    const res = await api.post(`/api/project/${id}/role`, newRole, {
      headers: {
        'X-Environment': env
      }
    });
    return res.data;
  }

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: string) => api.delete(`/api/project/${id}/role/${roleId}`, {
      headers: {
        'X-Environment': env
      }
    }),
    onSuccess: () => {
      refetch();
    },
  });

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role? This will also remove the role from all users.')) {
      deleteRoleMutation.mutate(roleId);
    }
  };
  return (
    <Paper p="md" radius="md">
      <Stack gap="sm">
        <Group justify={'space-between'} align="baseline">
          <Title order={4}>Roles</Title>
          <Button color={'teal'} onClick={() => setVisibleCreateRoleModal(true)}>
            <IconPlus size={18}/>&nbsp;Create Role
          </Button>
          <CreateModal
            onCreate={(data) => {
              onCreate(data).then((res) => {
                refetch().then()
                return res
              })
            }}
            opened={visibleCreateRoleModal}
            onClose={() => setVisibleCreateRoleModal(false)}
            formConfig={{
              fields: [
                {
                  name: "name",
                  label: "Role Name",
                  type: "text",
                  required: true,
                },
              ],
              submitLabel: "Create Role",
              title: "Create New Role",
            }}
          />
        </Group>
        <Table striped highlightOnHover withTableBorder withColumnBorders data={tableData}/>
      </Stack>
    </Paper>
  );
}

export function SettingsTab() {
  return (
    <Paper p="md" radius="md">
      <Title order={4}>Project Settings</Title>
      <Text size="sm">Configure project-specific settings such as roles, access, and preferences.</Text>
    </Paper>
  );
}

type CreateFormConfig = {
  title: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "password" | "textarea" | "select" | "multi_select";
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
  }>;
  submitLabel: string;
}

function CreateModal(props: {
  formConfig: CreateFormConfig,
  opened: boolean,
  onClose: () => void,
  onCreate?: (data: Record<string, any>) => unknown
}) {
  const mutation = useMutation({
    mutationFn: async (newRecord: any) => {
      if (props.onCreate) {
        return await props.onCreate(newRecord);
      }
      return Promise.resolve();
    },
  })
  return (
    <Modal opened={props.opened} onClose={props.onClose} title={props.formConfig.title}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Record<string, any> = {};
        props.formConfig.fields.forEach((field) => {
          const value = formData.get(field.name);
          if (value !== null) {
            data[field.name] = value;
          }
        });
        mutation.mutate(data)
        props.onClose();
      }}>
        <Stack gap="sm">
          {props.formConfig.fields.map((field: any) => {
            switch (field.type) {
              case "text":
              case "password":
              case "email":
                return (
                  <TextInput
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    required={field.required}
                    type={field.type}
                  />
                );
              case "textarea":
                return (
                  <Textarea
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    required={field.required}
                  />
                );
              case "select":
                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    data={field.options || []}
                    required={field.required}
                  />
                );
              case "multi_select":
                return (
                  <MultiSelect
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    data={field.options || []}
                    required={field.required}
                  />
                );
              default:
                return null;
            }
          })}
          <Button loading={mutation.isPending} type="submit">{props.formConfig.submitLabel}</Button>
        </Stack>
      </form>
    </Modal>
  );
}
