"use client";

import { useState } from "react";
import {
  Card,
  Title,
  TextInput,
  Textarea,
  Rating,
  Button,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";
import { LocalStorage } from "../utils/storage";
import { sanitizeInput } from "../utils/security";
import type { Testimonial } from "../types";

export function TestimonialForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      message: "",
      rating: 0,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      message: (value) =>
        value.length < 10 ? "Message must have at least 10 characters" : null,
      rating: (value) => (value === 0 ? "Please provide a rating" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      const testimonial: Testimonial = {
        id: uuidv4(),
        name: sanitizeInput(values.name),
        message: sanitizeInput(values.message),
        rating: values.rating,
        createdAt: new Date().toISOString(),
      };

      LocalStorage.add("testimonials", testimonial);

      notifications.show({
        title: "Thank you!",
        message: "Your testimonial has been submitted successfully.",
        color: "green",
      });

      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to submit testimonial. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Share Your Experience</Title>
        <Text size="sm" c="dimmed">
          Help others discover SEA Catering by sharing your experience with our
          meal plans.
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Your Name"
              placeholder="Enter your full name"
              required
              {...form.getInputProps("name")}
            />

            <Textarea
              label="Your Review"
              placeholder="Tell us about your experience with SEA Catering..."
              required
              minRows={4}
              {...form.getInputProps("message")}
            />

            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Rating
              </Text>
              <Rating {...form.getInputProps("rating")} />
            </Stack>

            <Button
              type="submit"
              loading={loading}
              leftSection={<IconSend size={16} />}
            >
              Submit Review
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
