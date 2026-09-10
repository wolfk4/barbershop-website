"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

const FormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(5, "Product title must be at least 5 characters."),
    v.maxLength(32, "Product title must be at most 32 characters.")
  ),

  image: v.pipe(
    v.string(),
    v.minLength(1, "Image URL is required.")
  ),

  price: v.pipe(
    v.number(),
    v.minValue(0, "Price cannot be negative.")
  ),

  description: v.pipe(
    v.string(),
    v.minLength(20, "Description must be at least 20 characters."),
    v.maxLength(100, "Description must be at most 100 characters.")
  ),

  moreInfo: v.pipe(
    v.string(),
    v.minLength(10, "More information must be at least 10 characters.")
  ),
})

export function CreateProductForm() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      title: "",
      image: "",
      price: 0,
      description: "",
      moreInfo: "",
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = async (output) => {
    try {
      const response = await fetch("/api/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(output),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      const product = await response.json()

      toast.success("Product created successfully", {
        description: `${product.title} was added to the shop.`,
        position: "bottom-right",
      })

      reset(form)
    } catch (error) {
      console.error(error)

      toast.error("Failed to create product", {
        description: "Something went wrong while creating the product.",
        position: "bottom-right",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>
          Fill in the details to create a new product.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form
          of={form}
          id="create-product-form"
          onSubmit={handleSubmit}
        >
          <FieldGroup>

            {/* Title */}
            <FormischField of={form} path={["title"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="product-title">
                    Product Title
                  </FieldLabel>

                  <Input
                    {...field.props}
                    id="product-title"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="Product title"
                    autoComplete="off"
                  />

                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({
                        message,
                      }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>

            {/* Image */}
            <FormischField of={form} path={["image"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="product-image">
                    Image URL
                  </FieldLabel>

                  <Input
                    {...field.props}
                    id="product-image"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="https://example.com/product.jpg"
                    autoComplete="off"
                  />

                  <FieldDescription>
                    Enter the URL of the product image.
                  </FieldDescription>

                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({
                        message,
                      }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>

            {/* Price */}
            <FormischField of={form} path={["price"]}>
            {(field) => (
                <Field data-invalid={field.errors !== null}>
                <FieldLabel htmlFor="product-price">
                    Price
                </FieldLabel>

                <Input
                    {...field.props}
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.input ?? 0}
                    onChange={(e) => {
                    const next = e.target.valueAsNumber;
                    field.onChange(Number.isNaN(next) ? undefined : next);
                    }}
                    aria-invalid={field.errors !== null}
                    placeholder="0.00"
                />

                {field.errors && (
                    <FieldError
                    errors={field.errors.map((message) => ({
                        message,
                    }))}
                    />
                )}
                </Field>
            )}
            </FormischField>
            {/* Description */}
            <FormischField of={form} path={["description"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="product-description">
                    Description
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupTextarea
                      {...field.props}
                      id="product-description"
                      value={field.input ?? ""}
                      placeholder="Describe the product..."
                      rows={5}
                      className="min-h-24 resize-none"
                      aria-invalid={field.errors !== null}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.input ?? "").length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({
                        message,
                      }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>

            {/* More Info */}
            <FormischField of={form} path={["moreInfo"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="product-more-info">
                    More Information
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupTextarea
                      {...field.props}
                      id="product-more-info"
                      value={field.input ?? ""}
                      placeholder="Add additional product information..."
                      rows={5}
                      className="min-h-24 resize-none"
                      aria-invalid={field.errors !== null}
                    />
                  </InputGroup>

                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({
                        message,
                      }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>

          </FieldGroup>
        </Form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset(form)}
          >
            Reset
          </Button>

          <Button
            type="submit"
            form="create-product-form"
          >
            Create Product
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
