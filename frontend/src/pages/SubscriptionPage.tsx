"use client";

import { Container, Stack, Title, Text } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { SubscriptionForm } from "../components/SubscriptionForm";

export function SubscriptionPage() {
  const [searchParams] = useSearchParams();
  const preSelectedPlan = searchParams.get("plan");

  return (
    <Container size="md">
      <Stack gap="xl" mt="xl">
        <Stack align="center" ta="center">
          <Title order={1}>Subscription Plans</Title>
          <Text size="lg" c="dimmed" maw={600}>
            Choose the perfect meal plan for your lifestyle and start your
            healthy eating journey today.
          </Text>
        </Stack>

        <SubscriptionForm preSelectedPlan={preSelectedPlan} />
      </Stack>
    </Container>
  );
}
