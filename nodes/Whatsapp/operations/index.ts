import type { INodeProperties } from 'n8n-workflow';

// All common prop

// All Operations
import * as sendTemplate from './sendTemplate.operation';
import * as sendSessionMessage from './sendSessionMessage.operation';

export { sendTemplate, sendSessionMessage };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Send a Template',
				value: 'sendTemplate',
				description: 'The Template you want to send',
				action: 'Send a template',
			},
			{
				name: 'Send Follow-up Message',
				value: 'sendSessionMessage',
				description: 'Send follow-up Message once session starts',
				action: 'Send a session message',
			},
		],
		default: 'sendTemplate',
	},
	...sendTemplate.description,
	...sendSessionMessage.description,
];
