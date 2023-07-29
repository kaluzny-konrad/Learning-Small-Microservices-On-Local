import { z } from 'zod';

export const CreateProductValidator = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(255, { message: 'Must be 255 or fewer characters long' }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(255, { message: 'Must be 255 or fewer characters long' })
    .optional(),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .min(0, { message: 'Must be 0 or more' })
    .max(1000000, { message: 'Must be 1000000 or fewer' }),
  imageName: z
    .string({
      invalid_type_error: 'Image URL must be a string',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(255, { message: 'Must be 255 or fewer characters long' })
    .optional(),
});
export type CreateProductDto = z.infer<typeof CreateProductValidator>;

export const UpdateProductValidator = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(255, { message: 'Must be 255 or fewer characters long' })
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(255, { message: 'Must be 255 or fewer characters long' })
    .optional(),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .min(0, { message: 'Must be 0 or more' })
    .max(1000000, { message: 'Must be 1000000 or fewer' })
    .optional(),
  imageName: z
    .string({
      invalid_type_error: 'Image URL must be a string',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(255, { message: 'Must be 255 or fewer characters long' })
    .optional(),
});
export type UpdateProductDto = z.infer<typeof UpdateProductValidator>;

export const GetProductsValidator = z.object({
  skip: z
    .number({
      invalid_type_error: 'Skip must be a number',
    })
    .min(0, { message: 'Must be 0 or more' })
    .optional(),
  take: z
    .number({
      invalid_type_error: 'Take must be a number',
    })
    .min(1, { message: 'Must be 1 or more' })
    .max(100, { message: 'Must be 100 or fewer' })
    .optional(),
});
export type GetProductsDto = z.infer<typeof GetProductsValidator>;
