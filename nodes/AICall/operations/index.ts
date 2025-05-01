import type { INodeProperties } from 'n8n-workflow';

// All Operations
import * as startCall from './startCall.operation';

export { startCall };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Start AI Call',
				value: 'startCall',
				action: 'Start AI Call',
			},
		],
		default: 'startCall',
	},
	...startCall.description,
];
