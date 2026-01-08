import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';

// Sanitize HTML to prevent XSS - strips all tags
export function sanitize(input: string): string {
    return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}

export const sanitizedString = (min: number, max: number, name: string = 'Field') =>
    z
        .string({ required_error: `${name} is required` })
        .min(min, `${name} must be at least ${min} character${min === 1 ? '' : 's'}`)
        .max(max, `${name} must be ${max} characters or less`)
        .transform(sanitize);

export const cuidSchema = z
    .string({ required_error: 'ID is required' })
    .cuid({ message: 'Invalid ID format' });
