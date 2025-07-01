import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  ThemeIcon,
  List,
  Anchor,
} from "@mantine/core";
import {
  IconLeaf,
  IconTruck,
  IconUsers,
  IconHeart,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { TestimonialCarousel } from "../components/TestimonialCarousel";

const features = [
  {
    icon: IconLeaf,
    title: "Meal Customization",
    description:
      "Personalize your meals according to your dietary preferences and nutritional needs.",
  },
  {
    icon: IconTruck,
    title: "Delivery to Major Cities",
    description:
      "We deliver fresh, healthy meals to major cities across Indonesia.",
  },
  {
    icon: IconHeart,
    title: "Detailed Nutritional Information",
    description:
      "Get complete nutritional breakdowns for every meal to help you track your health goals.",
  },
  {
    icon: IconUsers,
    title: "Flexible Plans",
    description:
      "Choose from various meal plans that fit your lifestyle and budget.",
  },
];

export function HomePage() {
  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Hero Section */}
        <Stack align="center" ta="center" gap="md" mt="xl">
          <Title order={1} size="3rem" fw={700} c="green.7">
            SEA Catering
          </Title>
          <Text size="xl" c="green.6" fw={500}>
            "Healthy Meals, Anytime, Anywhere"
          </Text>
          <Text size="lg" maw={600} c="dimmed">
            Welcome to SEA Catering, Indonesia's premier customizable healthy
            meal service. We're dedicated to delivering nutritious, delicious
            meals right to your doorstep, making healthy eating convenient and
            accessible across the nation.
          </Text>
          <Group mt="md">
            <Button
              component={Link}
              to="/menu"
              size="lg"
              leftSection={<IconLeaf size={20} />}
            >
              Explore Our Menu
            </Button>
            <Button
              component={Link}
              to="/subscription"
              variant="outline"
              size="lg"
            >
              Start Your Journey
            </Button>
          </Group>
        </Stack>

        {/* Features Section */}
        <Stack gap="md" mt="xl">
          <Title order={2} ta="center" mb="md">
            Why Choose SEA Catering?
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            {features.map((feature) => (
              <Card
                key={feature.title}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Stack align="center" ta="center">
                  <ThemeIcon
                    size={60}
                    radius="xl"
                    variant="light"
                    color="green"
                  >
                    <feature.icon size={30} />
                  </ThemeIcon>
                  <Title order={4}>{feature.title}</Title>
                  <Text size="sm" c="dimmed">
                    {feature.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        {/* About Section */}
        <Card shadow="sm" padding="xl" radius="md" withBorder mt="xl">
          <Stack gap="md">
            <Title order={2} c="green.7">
              About SEA Catering
            </Title>
            <Text>
              What started as a small business has quickly grown into a
              nationwide sensation. SEA Catering specializes in providing
              customizable healthy meal plans that can be delivered to cities
              across Indonesia. Our mission is to make healthy eating
              accessible, convenient, and delicious for everyone.
            </Text>
            <Text>
              With our rapid growth and increasing demand, we're committed to
              maintaining the highest quality standards while expanding our
              reach to serve more customers throughout Indonesia. Every meal is
              carefully crafted with fresh, locally-sourced ingredients and
              designed to meet your specific nutritional needs.
            </Text>
          </Stack>
        </Card>

        {/* Testimonials Section */}
        <TestimonialCarousel />

        {/* Contact Section */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md">
            <Title order={2} c="green.7">
              Get in Touch
            </Title>
            <Text>
              Ready to start your healthy eating journey? Contact us today to
              learn more about our meal plans and delivery options.
            </Text>
            <List spacing="sm" size="sm" center>
              <List.Item
                icon={
                  <ThemeIcon size={20} radius="xl" color="green">
                    <IconUser size={12} />
                  </ThemeIcon>
                }
              >
                <Text>
                  <strong>Manager:</strong> Brian
                </Text>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon size={20} radius="xl" color="green">
                    <IconPhone size={12} />
                  </ThemeIcon>
                }
              >
                <Text>
                  <strong>Phone:</strong>{" "}
                  <Anchor href="tel:08123456789" c="green.6">
                    08123456789
                  </Anchor>
                </Text>
              </List.Item>
            </List>
            <Group mt="md">
              <Button
                component={Link}
                to="/contact"
                leftSection={<IconPhone size={16} />}
              >
                Contact Us
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
