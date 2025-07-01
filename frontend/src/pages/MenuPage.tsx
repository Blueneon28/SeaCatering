"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Card,
  Button,
  Modal,
  List,
  ThemeIcon,
  Badge,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { IconCheck, IconLeaf } from "@tabler/icons-react";
import type { MealPlan } from "../types";
import { formatCurrency } from "../utils/calculations";

const mealPlans: MealPlan[] = [
  {
    id: "1",
    name: "Diet Plan",
    price: 30000,
    description: "Perfect for weight management and healthy living",
    features: [
      "Low calorie meals (300-400 calories)",
      "High fiber content",
      "Portion controlled",
      "Fresh vegetables and lean proteins",
      "Nutritionist approved",
    ],
  },
  {
    id: "2",
    name: "Protein Plan",
    price: 40000,
    description: "Ideal for fitness enthusiasts and muscle building",
    features: [
      "High protein content (25-30g per meal)",
      "Balanced macronutrients",
      "Post-workout friendly",
      "Premium ingredients",
      "Fitness coach recommended",
    ],
  },
  {
    id: "3",
    name: "Royal Plan",
    price: 60000,
    description: "Premium dining experience with gourmet meals",
    features: [
      "Gourmet ingredients",
      "Chef-crafted recipes",
      "Premium packaging",
      "Exclusive menu items",
      "Priority delivery",
    ],
  },
];

export function MenuPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const navigate = useNavigate();

  const handleSeeMore = (plan: MealPlan) => {
    setSelectedPlan(plan);
    open();
  };

  const handleChoosePlan = () => {
    if (selectedPlan) {
      navigate(`/subscription?plan=${selectedPlan.id}`);
      close();
    }
  };

  return (
    <Container size="lg">
      <Stack gap="xl" mt="xl">
        <Stack align="center" ta="center">
          <Title order={1}>Our Meal Plans</Title>
          <Text size="lg" c="dimmed" maw={600}>
            Choose from our carefully crafted meal plans, each designed to meet
            specific dietary needs and preferences.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {mealPlans.map((plan) => (
            <Card
              key={plan.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              h="100%"
            >
              <Stack justify="space-between" h="100%">
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={3} c="green.7">
                      {plan.name}
                    </Title>
                    <Badge color="green" variant="light">
                      {formatCurrency(plan.price)}/meal
                    </Badge>
                  </Group>

                  <Text c="dimmed">{plan.description}</Text>

                  <List
                    spacing="xs"
                    size="sm"
                    center
                    icon={
                      <ThemeIcon size={16} radius="xl" color="green">
                        <IconCheck size={12} />
                      </ThemeIcon>
                    }
                  >
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <List.Item key={index}>{feature}</List.Item>
                    ))}
                  </List>
                </Stack>

                <Button
                  onClick={() => handleSeeMore(plan)}
                  leftSection={<IconLeaf size={16} />}
                  fullWidth
                  mt="md"
                >
                  See More Details
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        <Modal
          opened={opened}
          onClose={close}
          title={selectedPlan?.name}
          size="md"
        >
          {selectedPlan && (
            <Stack gap="md">
              <Group>
                <Badge color="green" size="lg">
                  {formatCurrency(selectedPlan.price)} per meal
                </Badge>
              </Group>

              <Text>{selectedPlan.description}</Text>

              <Title order={4}>Features:</Title>
              <List
                spacing="sm"
                icon={
                  <ThemeIcon size={20} radius="xl" color="green">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                {selectedPlan.features.map((feature, index) => (
                  <List.Item key={index}>{feature}</List.Item>
                ))}
              </List>

              <Button
                size="lg"
                leftSection={<IconLeaf size={16} />}
                onClick={handleChoosePlan}
              >
                Choose This Plan
              </Button>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
}
