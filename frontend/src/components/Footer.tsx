import { Container, Group, Text } from "@mantine/core";

export function Footer() {
  return (
    <Container size="lg" h="100%">
      <Group justify="center" h="100%">
        <Text size="sm" c="dimmed">
          © 2024 SEA Catering. All rights reserved.
        </Text>
      </Group>
    </Container>
  );
}
