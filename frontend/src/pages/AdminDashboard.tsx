"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Stack,
  Card,
  Text,
  Group,
  SimpleGrid,
  Button,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  Alert,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconTrendingUp,
  IconUsers,
  IconRotateClockwise,
  IconCurrencyDollar,
  IconDots,
  IconEye,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react";
import { LocalStorage } from "../utils/storage";
import type { Subscription, DashboardMetrics } from "../types";
import { formatCurrency, formatDate } from "../utils/calculations";

export function AdminDashboard() {
  const [dateFrom, setDateFrom] = useState<Date | null>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [dateTo, setDateTo] = useState<Date | null>(new Date());
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    newSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    reactivations: 0,
    subscriptionGrowth: 0,
    totalActiveSubscriptions: 0,
  });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo]);

  const loadData = () => {
    const allSubscriptions = LocalStorage.get<Subscription>("subscriptions");
    setSubscriptions(allSubscriptions);
    calculateMetrics(allSubscriptions);
  };

  const calculateMetrics = (allSubscriptions: Subscription[]) => {
    // Check if dates are valid before proceeding
    if (!dateFrom || !dateTo) {
      console.log("Dates not set, using default metrics");
      const totalActiveSubscriptions = allSubscriptions.filter(
        (sub) => sub.status === "active"
      ).length;
      const monthlyRecurringRevenue = allSubscriptions
        .filter((sub) => sub.status === "active")
        .reduce((sum, sub) => sum + sub.totalPrice, 0);

      setMetrics({
        newSubscriptions: allSubscriptions.length,
        monthlyRecurringRevenue,
        reactivations: 0,
        subscriptionGrowth: totalActiveSubscriptions,
        totalActiveSubscriptions,
      });
      return;
    }

    try {
      const fromTime = dateFrom.getTime();
      const toTime = dateTo.getTime();

      // Filter subscriptions within date range
      const subscriptionsInRange = allSubscriptions.filter((sub) => {
        const createdTime = new Date(sub.createdAt).getTime();
        return createdTime >= fromTime && createdTime <= toTime;
      });

      // Calculate metrics
      const newSubscriptions = subscriptionsInRange.length;
      const monthlyRecurringRevenue = allSubscriptions
        .filter((sub) => sub.status === "active")
        .reduce((sum, sub) => sum + sub.totalPrice, 0);

      // Simulate reactivations (subscriptions that were cancelled and then recreated)
      const reactivations = Math.floor(newSubscriptions * 0.1); // 10% reactivation rate

      const totalActiveSubscriptions = allSubscriptions.filter(
        (sub) => sub.status === "active"
      ).length;
      const subscriptionGrowth = totalActiveSubscriptions;

      setMetrics({
        newSubscriptions,
        monthlyRecurringRevenue,
        reactivations,
        subscriptionGrowth,
        totalActiveSubscriptions,
      });
    } catch (error) {
      console.error("Error calculating metrics:", error);
      // Fallback to basic metrics
      const totalActiveSubscriptions = allSubscriptions.filter(
        (sub) => sub.status === "active"
      ).length;
      const monthlyRecurringRevenue = allSubscriptions
        .filter((sub) => sub.status === "active")
        .reduce((sum, sub) => sum + sub.totalPrice, 0);

      setMetrics({
        newSubscriptions: allSubscriptions.length,
        monthlyRecurringRevenue,
        reactivations: 0,
        subscriptionGrowth: totalActiveSubscriptions,
        totalActiveSubscriptions,
      });
    }
  };

  const handleDeleteSubscription = () => {
    if (!selectedSubscription) return;

    LocalStorage.delete("subscriptions", selectedSubscription.id);
    loadData();

    notifications.show({
      title: "Subscription Deleted",
      message: "The subscription has been deleted successfully.",
      color: "red",
    });

    closeDelete();
    setSelectedSubscription(null);
  };

  const handleUpdateMetrics = () => {
    if (!dateFrom || !dateTo) {
      notifications.show({
        title: "Invalid Date Range",
        message: "Please select both start and end dates.",
        color: "red",
      });
      return;
    }

    if (dateFrom > dateTo) {
      notifications.show({
        title: "Invalid Date Range",
        message: "Start date cannot be after end date.",
        color: "red",
      });
      return;
    }

    loadData();
    notifications.show({
      title: "Metrics Updated",
      message: "Dashboard metrics have been refreshed.",
      color: "green",
    });
  };

  const handleDateFromChange = (value: string | null) => {
    setDateFrom(value ? new Date(value) : null);
  };

  const handleDateToChange = (value: string | null) => {
    setDateTo(value ? new Date(value) : null);
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

  const metricCards = [
    {
      title: "New Subscriptions",
      value: metrics.newSubscriptions,
      icon: IconUsers,
      color: "blue",
    },
    {
      title: "Monthly Recurring Revenue",
      value: formatCurrency(metrics.monthlyRecurringRevenue),
      icon: IconCurrencyDollar,
      color: "green",
    },
    {
      title: "Reactivations",
      value: metrics.reactivations,
      icon: IconRotateClockwise,
      color: "orange",
    },
    {
      title: "Active Subscriptions",
      value: metrics.totalActiveSubscriptions,
      icon: IconTrendingUp,
      color: "purple",
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl" mt="xl">
        <Title order={1}>Admin Dashboard</Title>

        {/* Date Range Selector */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Date Range Filter</Title>
            <Group>
              <DatePickerInput
                label="From Date"
                placeholder="Select start date"
                value={dateFrom}
                onChange={handleDateFromChange}
                leftSection={<IconCalendar size={16} />}
                clearable
              />
              <DatePickerInput
                label="To Date"
                placeholder="Select end date"
                value={dateTo}
                onChange={handleDateToChange}
                leftSection={<IconCalendar size={16} />}
                minDate={dateFrom || undefined}
                clearable
              />
              <Button
                onClick={handleUpdateMetrics}
                mt="auto"
                leftSection={<IconRotateClockwise size={16} />}
              >
                Update Metrics
              </Button>
            </Group>
            {dateFrom && dateTo && (
              <Text size="sm" c="dimmed">
                Showing data from {formatDate(dateFrom.toISOString())} to{" "}
                {formatDate(dateTo.toISOString())}
              </Text>
            )}
          </Stack>
        </Card>

        {/* Metrics Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {metricCards.map((metric) => (
            <Card
              key={metric.title}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed" fw={500}>
                    {metric.title}
                  </Text>
                  <Text size="xl" fw={700}>
                    {metric.value}
                  </Text>
                </Stack>
                <metric.icon
                  size={32}
                  color={`var(--mantine-color-${metric.color}-6)`}
                />
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {/* Subscriptions Table */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>All Subscriptions ({subscriptions.length})</Title>

            {subscriptions.length === 0 ? (
              <Alert icon={<IconAlertCircle size={16} />} color="blue">
                No subscriptions found. Create some test subscriptions to see
                them here.
              </Alert>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Plan</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Monthly Price</Table.Th>
                    <Table.Th>Created</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {subscriptions.map((subscription) => (
                    <Table.Tr key={subscription.id}>
                      <Table.Td>
                        <Stack gap={0}>
                          <Text size="sm" fw={500}>
                            {subscription.userName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {subscription.userEmail}
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>{subscription.planName}</Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(subscription.status)}>
                          {subscription.status.toUpperCase()}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {formatCurrency(subscription.totalPrice)}
                      </Table.Td>
                      <Table.Td>{formatDate(subscription.createdAt)}</Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEye size={14} />}
                              onClick={() => {
                                setSelectedSubscription(subscription);
                                openDetails();
                              }}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => {
                                setSelectedSubscription(subscription);
                                openDelete();
                              }}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Card>

        {/* Subscription Details Modal */}
        <Modal
          opened={detailsOpened}
          onClose={closeDetails}
          title="Subscription Details"
          size="md"
        >
          {selectedSubscription && (
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>Customer:</Text>
                <Text>{selectedSubscription.userName}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Email:</Text>
                <Text>{selectedSubscription.userEmail}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Phone:</Text>
                <Text>{selectedSubscription.phone}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Plan:</Text>
                <Text>{selectedSubscription.planName}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Status:</Text>
                <Badge color={getStatusColor(selectedSubscription.status)}>
                  {selectedSubscription.status.toUpperCase()}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Meal Types:</Text>
                <Text>{selectedSubscription.mealTypes.join(", ")}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Delivery Days:</Text>
                <Text>{selectedSubscription.deliveryDays.join(", ")}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Monthly Price:</Text>
                <Text fw={700}>
                  {formatCurrency(selectedSubscription.totalPrice)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Created:</Text>
                <Text>{formatDate(selectedSubscription.createdAt)}</Text>
              </Group>
              {selectedSubscription.allergies && (
                <Group justify="space-between">
                  <Text fw={500}>Allergies:</Text>
                  <Text>{selectedSubscription.allergies}</Text>
                </Group>
              )}
              {selectedSubscription.status === "paused" &&
                selectedSubscription.pausedFrom &&
                selectedSubscription.pausedTo && (
                  <Alert color="blue">
                    Paused from {formatDate(selectedSubscription.pausedFrom)} to{" "}
                    {formatDate(selectedSubscription.pausedTo)}
                  </Alert>
                )}
            </Stack>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteOpened}
          onClose={closeDelete}
          title="Delete Subscription"
        >
          <Stack gap="md">
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              Are you sure you want to delete this subscription? This action
              cannot be undone.
            </Alert>

            <Group justify="flex-end">
              <Button variant="outline" onClick={closeDelete}>
                Cancel
              </Button>
              <Button
                color="red"
                onClick={handleDeleteSubscription}
                leftSection={<IconTrash size={16} />}
              >
                Delete Subscription
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
