import type { INodeProperties } from 'n8n-workflow';

// All Operations
import * as getCandidatesByStage from './getCandidatesByStage.operation';
import * as moveCandidatesToSpecificStage from './moveCandidatesToSpecificStage.operation';

export { getCandidatesByStage, moveCandidatesToSpecificStage };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get all candidates by stage',
				value: 'getCandidatesByStage',
				action: 'Get all candidates by stage',
			},
			{
				name: 'Move candidate to specific stage in pipeline',
				value: 'moveCandidatesToSpecificStage',
				action: 'Move candidates to Specific Stage',
			},
		],
		default: 'getCandidatesByStage',
	},
	...getCandidatesByStage.description,
	...moveCandidatesToSpecificStage.description,
];
