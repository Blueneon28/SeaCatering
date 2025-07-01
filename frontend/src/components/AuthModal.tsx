"use client";

import { useState } from "react";
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Tabs,
  Alert,
  List,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconLogin, IconUserPlus } from "@tabler/icons-react";
import { useAuth } from "../contexts/AuthContext";
import {
  validateEmail,
  validatePassword,
  sanitizeInput,
} from "../utils/security";

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
}

export function AuthModal({ opened, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("login");
  const { login, register } = useAuth();

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        !validateEmail(value) ? "Invalid email address" : null,
      password: (value) => (value.length === 0 ? "Password is required" : null),
    },
  });

  const registerForm = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        !validateEmail(value) ? "Invalid email address" : null,
      password: (value) => {
        const validation = validatePassword(value);
        return validation.isValid ? null : validation.errors[0];
      },
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleLogin = async (values: typeof loginForm.values) => {
    setLoading(true);
    try {
      const success = await login(sanitizeInput(values.email), values.password);

      if (success) {
        notifications.show({
          title: "Welcome back!",
          message: "You have been logged in successfully.",
          color: "green",
        });
        onClose();
        loginForm.reset();
      } else {
        notifications.show({
          title: "Login Failed",
          message: "Invalid email or password.",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "An error occurred during login.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: typeof registerForm.values) => {
    setLoading(true);
    try {
      const success = await register(
        sanitizeInput(values.name),
        sanitizeInput(values.email),
        values.password
      );

      if (success) {
        notifications.show({
          title: "Account Created!",
          message: "Your account has been created successfully.",
          color: "green",
        });
        onClose();
        registerForm.reset();
      } else {
        notifications.show({
          title: "Registration Failed",
          message: "Email already exists or invalid data provided.",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "An error occurred during registration.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Authentication" size="md">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab value="login" leftSection={<IconLogin size={16} />}>
            Login
          </Tabs.Tab>
          <Tabs.Tab value="register" leftSection={<IconUserPlus size={16} />}>
            Register
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login" pt="md">
          <form onSubmit={loginForm.onSubmit(handleLogin)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...loginForm.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                {...loginForm.getInputProps("password")}
              />

              <Button type="submit" loading={loading} fullWidth>
                Login
              </Button>

              <Alert icon={<IconAlertCircle size={16} />} color="blue">
                <Text size="sm">
                  <strong>Demo Admin Account:</strong>
                  <br />
                  Email: admin@seacatering.com
                  <br />
                  Password: Admin123!
                </Text>
              </Alert>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="register" pt="md">
          <form onSubmit={registerForm.onSubmit(handleRegister)}>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Your full name"
                required
                {...registerForm.getInputProps("name")}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...registerForm.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                required
                {...registerForm.getInputProps("password")}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                {...registerForm.getInputProps("confirmPassword")}
              />

              <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                <Text size="sm" fw={500}>
                  Password Requirements:
                </Text>
                <List size="xs" mt="xs">
                  <List.Item>At least 8 characters long</List.Item>
                  <List.Item>
                    Contains uppercase and lowercase letters
                  </List.Item>
                  <List.Item>Contains at least one number</List.Item>
                  <List.Item>Contains at least one special character</List.Item>
                </List>
              </Alert>

              <Button type="submit" loading={loading} fullWidth>
                Create Account
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
