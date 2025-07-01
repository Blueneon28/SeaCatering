import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  List,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import { IconUser, IconPhone, IconMapPin } from "@tabler/icons-react";

export function ContactPage() {
  return (
    <Container size="lg">
      <Stack gap="xl" mt="xl">
        <Title order={1}>Contact Us</Title>

        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md">
            <Title order={2} c="green.7">
              Get in Touch
            </Title>
            <Text>
              We'd love to hear from you! Contact our team for any questions
              about our meal plans, delivery options, or to start your healthy
              eating journey.
            </Text>

            <List spacing="md" size="lg" mt="md">
              <List.Item
                icon={
                  <ThemeIcon size={24} radius="xl" color="green">
                    <IconUser size={16} />
                  </ThemeIcon>
                }
              >
                <Text size="lg">
                  <strong>Manager:</strong> Brian
                </Text>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon size={24} radius="xl" color="green">
                    <IconPhone size={16} />
                  </ThemeIcon>
                }
              >
                <Text size="lg">
                  <strong>Phone:</strong>{" "}
                  <Anchor href="tel:08123456789" c="green.6">
                    08123456789
                  </Anchor>
                </Text>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon size={24} radius="xl" color="green">
                    <IconMapPin size={16} />
                  </ThemeIcon>
                }
              >
                <Text size="lg">
                  <strong>Service Area:</strong> Major cities across Indonesia
                </Text>
              </List.Item>
            </List>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
