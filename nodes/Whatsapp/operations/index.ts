import type { INodeProperties } from 'n8n-workflow';

// All common prop

// All Operations
import * as sendTemplate from './sendTemplate.operation';
import * as sendSessionMessage from './sendSessionMessage.operation';
import * as sendAlert from './sendAlert.operation';
import * as getTemplate from './getTemplate.operation';

export { sendTemplate, sendSessionMessage, sendAlert, getTemplate };

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
			{
				name: 'Send Alert Message',
				value: 'sendAlert',
				description: 'Send alert message (without tracking by tidyhire)',
				action: 'Send a alert message',
			},
			{
				name: 'Get Whatsapp Template',
				value: 'getTemplate',
				action: 'Get template',
			},
		],
		default: 'sendTemplate',
	},
	...sendTemplate.description,
	...sendSessionMessage.description,
	...sendAlert.description,
	...getTemplate.description,
];
