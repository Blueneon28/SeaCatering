"use client";
import {
  Container,
  Group,
  Burger,
  Text,
  Drawer,
  Stack,
  UnstyledButton,
  Menu,
  Avatar,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import { IconLeaf, IconLogout, IconDashboard } from "@tabler/icons-react";
import classes from "./Header.module.css";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

const links = [
  { link: "/", label: "Home" },
  { link: "/menu", label: "Menu" },
  { link: "/subscription", label: "Subscription" },
  { link: "/testimonials", label: "Testimonials" },
  { link: "/contact", label: "Contact" },
];

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [authOpened, { open: openAuth, close: closeAuth }] =
    useDisclosure(false);

  const items = links.map((link) => (
    <UnstyledButton
      key={link.label}
      component={Link}
      to={link.link}
      className={classes.link}
      data-active={location.pathname === link.link || undefined}
      onClick={close}
    >
      {link.label}
    </UnstyledButton>
  ));

  const mobileItems = links.map((link) => (
    <UnstyledButton
      key={link.label}
      component={Link}
      to={link.link}
      className={classes.mobileLink}
      data-active={location.pathname === link.link || undefined}
      onClick={close}
    >
      {link.label}
    </UnstyledButton>
  ));

  return (
    <Container size="lg" className={classes.header}>
      <Group justify="space-between" h="100%" w="100%">
        <Group>
          <IconLeaf size={28} color="var(--mantine-color-green-6)" />
          <Text size="xl" fw={700} c="green.6">
            SEA Catering
          </Text>
        </Group>

        <Group gap="xs" visibleFrom="sm">
          {items}
          {isAuthenticated ? (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton style={{ marginLeft: "20px" }}>
                  <Avatar color="green" radius="xl" size="sm">
                    {user?.name.charAt(0)}
                  </Avatar>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user?.name}</Menu.Label>
                <Menu.Item
                  leftSection={<IconDashboard size={14} />}
                  component={Link}
                  to={user?.role === "admin" ? "/admin" : "/dashboard"}
                >
                  Dashboard
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  onClick={logout}
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              onClick={openAuth}
              variant="outline"
              size="sm"
              style={{ marginLeft: "20px" }}
            >
              Login
            </Button>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Stack gap="sm" mt="md">
          {mobileItems}
        </Stack>
      </Drawer>
      <AuthModal opened={authOpened} onClose={closeAuth} />
    </Container>
  );
}
