export const errorLogJsonSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    message: { type: 'string' },
    code: { type: 'string' },
    name: { type: 'string' },
    path: { type: 'string' },
    stack: { type: 'object' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'message'],
  additionalProperties: false,
} as const;
