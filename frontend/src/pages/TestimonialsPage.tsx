import { Container, Stack, SimpleGrid } from "@mantine/core";
import { TestimonialForm } from "../components/TestimonialForm";
import { TestimonialCarousel } from "../components/TestimonialCarousel";

export function TestimonialsPage() {
  return (
    <Container size="lg">
      <Stack gap="xl" mt="xl">
        <TestimonialCarousel />

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <TestimonialForm />
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
