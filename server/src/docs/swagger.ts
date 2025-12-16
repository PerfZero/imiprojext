import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'IMI Core API',
    version: '1.0.0',
    description:
      'REST API for wallet balances, MLM payouts, notifications, authentication and transaction management.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Users' },
    { name: 'Wallet' },
    { name: 'Transactions' },
    { name: 'Notifications' },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string', nullable: true },
          referralCode: { type: 'string' },
          referrerId: { type: 'integer', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Balance: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          currency: { type: 'string' },
          balance: { type: 'number' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          currency: { type: 'string' },
          amount: { type: 'number' },
          type: { type: 'string' },
          metadata: { type: 'object', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          category: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'object', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      DepositRequest: {
        type: 'object',
        required: ['userId', 'currency', 'amount'],
        properties: {
          userId: { type: 'integer' },
          currency: { type: 'string' },
          amount: { type: 'number' },
        },
      },
      ConvertRequest: {
        type: 'object',
        required: ['userId', 'fromCurrency', 'toCurrency', 'amount', 'rate'],
        properties: {
          userId: { type: 'integer' },
          fromCurrency: { type: 'string' },
          toCurrency: { type: 'string' },
          amount: { type: 'number' },
          rate: { type: 'number' },
        },
      },
      PurchaseRequest: {
        type: 'object',
        required: ['userId', 'currency', 'amount'],
        properties: {
          userId: { type: 'integer' },
          currency: { type: 'string' },
          amount: { type: 'number' },
          description: { type: 'string' },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          referrerCode: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Create user record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Fetch user by id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'User',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
        },
      },
    },
    '/users/{id}/balances': {
      get: {
        tags: ['Users'],
        summary: 'List balances for user',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Balances',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Balance' } },
              },
            },
          },
        },
      },
    },
    '/users/avatar': {
      post: {
        tags: ['Users'],
        summary: 'Upload avatar for current user',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  avatar: {
                    type: 'string',
                    format: 'binary',
                  },
                },
                required: ['avatar'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Avatar updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    image: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}/upline': {
      get: {
        tags: ['Users'],
        summary: 'Get MLM upline up to 7 levels',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Upline chain',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
              },
            },
          },
        },
      },
    },
    '/wallet/deposit': {
      post: {
        tags: ['Wallet'],
        summary: 'Deposit funds',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DepositRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Updated balance',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Balance' } },
            },
          },
        },
      },
    },
    '/wallet/withdraw': {
      post: {
        tags: ['Wallet'],
        summary: 'Withdraw funds',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DepositRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Updated balance',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Balance' } },
            },
          },
        },
      },
    },
    '/wallet/convert': {
      post: {
        tags: ['Wallet'],
        summary: 'Convert between currencies',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ConvertRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Balance in destination currency',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Balance' } },
            },
          },
        },
      },
    },
    '/wallet/purchase': {
      post: {
        tags: ['Wallet'],
        summary: 'Register purchase and trigger MLM rewards',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PurchaseRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Purchase accepted',
            content: {
              'application/json': { schema: { type: 'object', properties: { status: { type: 'string' } } } },
            },
          },
        },
      },
    },
    '/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'List transactions optionally filtered by user',
        parameters: [
          {
            in: 'query',
            name: 'userId',
            required: false,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Transactions',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } },
              },
            },
          },
        },
      },
    },
    '/transactions/getMlmIncomeByLevel': {
      get: {
        tags: ['Transactions'],
        summary: 'Get MLM income by level for user',
        parameters: [
          {
            in: 'query',
            name: 'userId',
            required: false,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'MLM income by level',
            content: {
              'application/json': {
                schema: {
                  type: 'array', items: {
                    type: 'object',
                    properties: {
                      level: { type: 'integer' },
                      income: { type: 'number' }
                    }
                  }
                },
              },
            },
          },
        },
      },
    },
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'List notifications optionally filtered by user',
        parameters: [
          {
            in: 'query',
            name: 'userId',
            required: false,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Notifications',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});

