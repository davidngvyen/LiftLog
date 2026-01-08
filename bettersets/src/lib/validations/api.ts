import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

export async function validateBody<T>(
    req: Request,
    schema: ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse }> {
    try {
        const body = await req.json();
        const data = schema.parse(body);
        return { data };
    } catch (e) {
        if (e instanceof ZodError) {
            // Format Zod errors into a readable structure
            const formattedErrors = e.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return {
                error: NextResponse.json(
                    {
                        error: 'VALIDATION_ERROR',
                        details: formattedErrors,
                        message: 'Validation failed'
                    },
                    { status: 400 }
                ),
            };
        }
        return {
            error: NextResponse.json({ error: 'BAD_REQUEST', message: 'Invalid JSON body' }, { status: 400 }),
        };
    }
}
