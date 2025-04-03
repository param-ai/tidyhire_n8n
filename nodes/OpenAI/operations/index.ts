import type { INodeProperties } from 'n8n-workflow';

// All Operations
import * as extractStructuredData from './extractStructuredData.operation';
import * as askChatgpt from './askChatgpt.operation';

export { extractStructuredData, askChatgpt };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Ask ChatGPT',
				value: 'askChatgpt',
				description: 'Ask ChatGPT anything you want!',
				action: 'Ask ChatGPT',
			},
			{
				name: 'Extract Structured Data from Text',
				value: 'extractStructuredData',
				description: 'Returns structured data from provided unstructured text.',
				action: 'Extract structured data',
			},
		],
		default: 'extractStructuredData',
	},
	...extractStructuredData.description,
	...askChatgpt.description,
];
