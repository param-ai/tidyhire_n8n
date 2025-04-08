import type { INodeProperties } from 'n8n-workflow';

import * as sendEmail from './operations/sendEmail.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Send an automated email',
				value: 'sendEmail',
				description: 'Send an email to candidate',
				action: 'Send a email',
			},
		],
		default: 'sendEmail',
		// displayOptions: {
		// 	show: {
		// 		resource: ['whatsapp'],
		// 	},
		// },
	},
	...sendEmail.description,
];
