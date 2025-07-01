"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Stack,
  Card,
  Text,
  Badge,
  Button,
  Group,
  Modal,
  Alert,
  SimpleGrid,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconPlayerPause,
  IconX,
  IconDots,
  IconCalendar,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useAuth } from "../contexts/AuthContext";
import { LocalStorage } from "../utils/storage";
import type { Subscription } from "../types";
import { formatCurrency, formatDate } from "../utils/calculations";

export function UserDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [pauseOpened, { open: openPause, close: closePause }] =
    useDisclosure(false);
  const [cancelOpened, { open: openCancel, close: closeCancel }] =
    useDisclosure(false);
  const [pauseFromDate, setPauseFromDate] = useState<Date | null>(null);
  const [pauseToDate, setPauseToDate] = useState<Date | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const allSubscriptions = LocalStorage.get<Subscription>("subscriptions");
      const userSubscriptions = allSubscriptions.filter(
        (sub) => sub.userId === user.id
      );
      setSubscriptions(userSubscriptions);
    }
  }, [user]);

  const handlePauseSubscription = () => {
    if (!selectedSubscription || !pauseFromDate || !pauseToDate) return;

    const updatedSubscription = {
      ...selectedSubscription,
      status: "paused" as const,
      pausedFrom: pauseFromDate.toISOString(),
      pausedTo: pauseToDate.toISOString(),
    };

    LocalStorage.update(
      "subscriptions",
      selectedSubscription.id,
      updatedSubscription
    );

    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubscription.id ? updatedSubscription : sub
      )
    );

    notifications.show({
      title: "Subscription Paused",
      message: `Your subscription has been paused from ${formatDate(
        pauseFromDate.toISOString()
      )} to ${formatDate(pauseToDate.toISOString())}.`,
      color: "blue",
    });

    closePause();
    setPauseFromDate(null);
    setPauseToDate(null);
    setSelectedSubscription(null);
  };

  const handleCancelSubscription = () => {
    if (!selectedSubscription) return;

    LocalStorage.update("subscriptions", selectedSubscription.id, {
      status: "cancelled" as const,
    });

    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubscription.id
          ? { ...sub, status: "cancelled" as const }
          : sub
      )
    );

    notifications.show({
      title: "Subscription Cancelled",
      message: "Your subscription has been cancelled successfully.",
      color: "red",
    });

    closeCancel();
    setSelectedSubscription(null);
  };

  const handlePauseFromDateChange = (value: string | null) => {
    setPauseFromDate(value ? new Date(value) : null);
  };

  const handlePauseToDateChange = (value: string | null) => {
    setPauseToDate(value ? new Date(value) : null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "paused":
        return "blue";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Container size="lg">
      <Stack gap="xl" mt="xl">
        <Title order={1}>My Dashboard</Title>

        {subscriptions.length === 0 ? (
          <Alert icon={<IconAlertCircle size={16} />} color="blue">
            You don't have any subscriptions yet. Create your first subscription
            to get started!
          </Alert>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {subscriptions.map((subscription) => (
              <Card
                key={subscription.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={3}>{subscription.planName}</Title>
                    <Group>
                      <Badge color={getStatusColor(subscription.status)}>
                        {subscription.status.toUpperCase()}
                      </Badge>
                      {subscription.status === "active" && (
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconPlayerPause size={14} />}
                              onClick={() => {
                                setSelectedSubscription(subscription);
                                openPause();
                              }}
                            >
                              Pause Subscription
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconX size={14} />}
                              color="red"
                              onClick={() => {
                                setSelectedSubscription(subscription);
                                openCancel();
                              }}
                            >
                              Cancel Subscription
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Group>
                  </Group>

                  <Stack gap="xs">
                    <Text size="sm">
                      <strong>Meal Types:</strong>{" "}
                      {subscription.mealTypes.join(", ")}
                    </Text>
                    <Text size="sm">
                      <strong>Delivery Days:</strong>{" "}
                      {subscription.deliveryDays.join(", ")}
                    </Text>
                    <Text size="sm">
                      <strong>Monthly Price:</strong>{" "}
                      {formatCurrency(subscription.totalPrice)}
                    </Text>
                    <Text size="sm">
                      <strong>Created:</strong>{" "}
                      {formatDate(subscription.createdAt)}
                    </Text>
                    {subscription.allergies && (
                      <Text size="sm">
                        <strong>Allergies:</strong> {subscription.allergies}
                      </Text>
                    )}
                    {subscription.status === "paused" &&
                      subscription.pausedFrom &&
                      subscription.pausedTo && (
                        <Alert color="blue">
                          Paused from {formatDate(subscription.pausedFrom)} to{" "}
                          {formatDate(subscription.pausedTo)}
                        </Alert>
                      )}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Pause Modal */}
        <Modal
          opened={pauseOpened}
          onClose={closePause}
          title="Pause Subscription"
        >
          <Stack gap="md">
            <Text>
              Select the date range for pausing your subscription. No charges
              will be applied during this period.
            </Text>

            <DatePickerInput
              label="Pause From"
              placeholder="Select start date"
              value={pauseFromDate}
              onChange={handlePauseFromDateChange}
              minDate={new Date()}
              leftSection={<IconCalendar size={16} />}
            />

            <DatePickerInput
              label="Pause To"
              placeholder="Select end date"
              value={pauseToDate}
              onChange={handlePauseToDateChange}
              minDate={pauseFromDate || new Date()}
              leftSection={<IconCalendar size={16} />}
            />

            <Group justify="flex-end">
              <Button variant="outline" onClick={closePause}>
                Cancel
              </Button>
              <Button
                onClick={handlePauseSubscription}
                disabled={!pauseFromDate || !pauseToDate}
                leftSection={<IconPlayerPause size={16} />}
              >
                Pause Subscription
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Cancel Modal */}
        <Modal
          opened={cancelOpened}
          onClose={closeCancel}
          title="Cancel Subscription"
        >
          <Stack gap="md">
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              Are you sure you want to cancel this subscription? This action
              cannot be undone.
            </Alert>

            <Group justify="flex-end">
              <Button variant="outline" onClick={closeCancel}>
                Keep Subscription
              </Button>
              <Button
                color="red"
                onClick={handleCancelSubscription}
                leftSection={<IconX size={16} />}
              >
                Cancel Subscription
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
