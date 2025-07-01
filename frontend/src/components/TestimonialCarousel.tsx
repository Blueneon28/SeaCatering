"use client";

import { useEffect, useState } from "react";
import { Card, Text, Group, Avatar, Rating, Stack, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { LocalStorage } from "../utils/storage";
import type { Testimonial } from "../types";
import { formatDate } from "../utils/calculations";

// Sample testimonials for initial display
const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    message:
      "SEA Catering has transformed my eating habits! The meals are delicious, nutritious, and perfectly portioned. Delivery is always on time.",
    rating: 5,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Michael Chen",
    message:
      "As a busy professional, SEA Catering saves me so much time. The Protein Plan is perfect for my fitness goals. Highly recommended!",
    rating: 5,
    createdAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    name: "Priya Sharma",
    message:
      "The Royal Plan is absolutely amazing! Every meal feels like dining at a high-end restaurant. Worth every rupiah.",
    rating: 4,
    createdAt: "2024-01-05T09:15:00Z",
  },
];

export function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Load testimonials from storage, fallback to samples
    const stored = LocalStorage.get<Testimonial>("testimonials");
    if (stored.length === 0) {
      // Initialize with sample testimonials
      sampleTestimonials.forEach((testimonial) => {
        LocalStorage.add("testimonials", testimonial);
      });
      setTestimonials(sampleTestimonials);
    } else {
      setTestimonials(stored);
    }
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <Stack gap="md">
      <Title order={3} ta="center">
        What Our Customers Say
      </Title>

      <Carousel
        withIndicators
        height={200}
        slideSize="100%"
        slideGap="md"
        loop
        align="start"
      >
        {testimonials.map((testimonial) => (
          <Carousel.Slide key={testimonial.id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Stack justify="space-between" h="100%">
                <Text size="sm" style={{ fontStyle: "italic" }}>
                  "{testimonial.message}"
                </Text>

                <Group justify="space-between">
                  <Group>
                    <Avatar color="green" radius="xl">
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Stack gap={0}>
                      <Text size="sm" fw={500}>
                        {testimonial.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatDate(testimonial.createdAt)}
                      </Text>
                    </Stack>
                  </Group>
                  <Rating value={testimonial.rating} readOnly size="sm" />
                </Group>
              </Stack>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Stack>
  );
}
