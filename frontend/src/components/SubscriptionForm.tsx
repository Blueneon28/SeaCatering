"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Title,
  TextInput,
  Select,
  MultiSelect,
  Textarea,
  Button,
  Stack,
  Text,
  Group,
  Divider,
  Alert,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";
import { LocalStorage } from "../utils/storage";
import { sanitizeInput, validatePhone } from "../utils/security";
import {
  calculateSubscriptionPrice,
  formatCurrency,
} from "../utils/calculations";
import type { Subscription } from "../types";
import { useAuth } from "../contexts/AuthContext";

const mealPlans = [
  { value: "1", label: "Diet Plan - Rp30,000 per meal", price: 30000 },
  { value: "2", label: "Protein Plan - Rp40,000 per meal", price: 40000 },
  { value: "3", label: "Royal Plan - Rp60,000 per meal", price: 60000 },
];

const mealTypes = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

const deliveryDays = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

interface SubscriptionFormProps {
  preSelectedPlan?: string | null;
}

export function SubscriptionForm({ preSelectedPlan }: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const { user, isAuthenticated } = useAuth();

  const form = useForm({
    initialValues: {
      name: user?.name || "",
      phone: "",
      planId: preSelectedPlan || "",
      mealTypes: [] as string[],
      deliveryDays: [] as string[],
      allergies: "",
      agreeToTerms: false,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      phone: (value) =>
        !validatePhone(value)
          ? "Please enter a valid Indonesian phone number"
          : null,
      planId: (value) => (!value ? "Please select a meal plan" : null),
      mealTypes: (value) =>
        value.length === 0 ? "Please select at least one meal type" : null,
      deliveryDays: (value) =>
        value.length === 0 ? "Please select at least one delivery day" : null,
      agreeToTerms: (value) =>
        !value ? "You must agree to the terms and conditions" : null,
    },
  });

  // Handle pre-selected plan
  useEffect(() => {
    if (preSelectedPlan) {
      form.setFieldValue("planId", preSelectedPlan);
    }
  }, [preSelectedPlan]);

  const calculatePrice = () => {
    const { planId, mealTypes, deliveryDays } = form.values;
    if (planId && mealTypes.length > 0 && deliveryDays.length > 0) {
      const selectedPlan = mealPlans.find((plan) => plan.value === planId);
      if (selectedPlan) {
        const price = calculateSubscriptionPrice(
          selectedPlan.price,
          mealTypes,
          deliveryDays
        );
        setCalculatedPrice(price);
      }
    } else {
      setCalculatedPrice(0);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!isAuthenticated || !user) {
      notifications.show({
        title: "Authentication Required",
        message: "Please log in to create a subscription.",
        color: "red",
      });
      return;
    }

    setLoading(true);

    try {
      const selectedPlan = mealPlans.find(
        (plan) => plan.value === values.planId
      )!;

      const subscription: Subscription = {
        id: uuidv4(),
        userId: user.id,
        userName: sanitizeInput(values.name),
        userEmail: user.email,
        phone: sanitizeInput(values.phone),
        planId: values.planId,
        planName: selectedPlan.label.split(" - ")[0],
        planPrice: selectedPlan.price,
        mealTypes: values.mealTypes,
        deliveryDays: values.deliveryDays,
        allergies: values.allergies
          ? sanitizeInput(values.allergies)
          : undefined,
        totalPrice: calculatedPrice,
        status: "active",
        createdAt: new Date().toISOString(),
      };

      LocalStorage.add("subscriptions", subscription);

      notifications.show({
        title: "Subscription Created!",
        message: "Your meal subscription has been created successfully.",
        color: "green",
      });

      form.reset();
      setCalculatedPrice(0);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create subscription. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Recalculate price when form values change
  useEffect(() => {
    calculatePrice();
  }, [form.values.planId, form.values.mealTypes, form.values.deliveryDays]);

  if (!isAuthenticated) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Authentication Required"
        color="red"
      >
        Please log in to create a subscription. You can register for a new
        account or log in with existing credentials.
      </Alert>
    );
  }

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <Stack gap="md">
        <Title order={2}>Create Your Subscription</Title>
        <Text c="dimmed">
          Customize your meal plan according to your preferences and dietary
          needs.
        </Text>

        {preSelectedPlan && (
          <Alert color="green" variant="light">
            <Text size="sm">
              Great choice! You've selected the{" "}
              {
                mealPlans
                  .find((p) => p.value === preSelectedPlan)
                  ?.label.split(" - ")[0]
              }{" "}
              from our menu.
            </Text>
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              required
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Active Phone Number"
              placeholder="08123456789"
              required
              {...form.getInputProps("phone")}
            />

            <Select
              label="Plan Selection"
              placeholder="Choose your meal plan"
              required
              data={mealPlans}
              {...form.getInputProps("planId")}
            />

            <MultiSelect
              label="Meal Type"
              placeholder="Select meal types (at least one)"
              required
              data={mealTypes}
              {...form.getInputProps("mealTypes")}
            />

            <MultiSelect
              label="Delivery Days"
              placeholder="Select delivery days"
              required
              data={deliveryDays}
              {...form.getInputProps("deliveryDays")}
            />

            <Textarea
              label="Allergies"
              placeholder="List any allergies or dietary restrictions (optional)"
              minRows={3}
              {...form.getInputProps("allergies")}
            />

            <Divider />

            {calculatedPrice > 0 && (
              <Card withBorder p="md" bg="green.0">
                <Group justify="space-between">
                  <Text fw={500}>Total Monthly Price:</Text>
                  <Text size="xl" fw={700} c="green.7">
                    {formatCurrency(calculatedPrice)}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed" mt="xs">
                  Calculated as: Plan Price × Meal Types × Delivery Days × 4.3
                  weeks
                </Text>
              </Card>
            )}

            <Checkbox
              label="I agree to the terms and conditions"
              required
              {...form.getInputProps("agreeToTerms", { type: "checkbox" })}
            />

            <Button
              type="submit"
              loading={loading}
              leftSection={<IconCheck size={16} />}
              size="lg"
              disabled={calculatedPrice === 0}
            >
              Create Subscription
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
