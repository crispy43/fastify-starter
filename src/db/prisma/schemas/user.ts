export const userJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['id', 'email'],
  additionalProperties: false,
} as const;
