import type { INodeProperties } from 'n8n-workflow';


// All Operations
import * as extractStructuredData from './extractStructuredData.operation';

export { extractStructuredData };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
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
];
