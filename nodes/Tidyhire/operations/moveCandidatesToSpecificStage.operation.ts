import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { candidateProperties, projectProperties } from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                tidyhire:moveCandidatesToSpecificStage                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...projectProperties,
	...candidateProperties,
	{
		displayName: 'Stage',
		name: 'stage',
		type: 'options',
		options: [
			{
				name: 'Shortlisted',
				value: 'shortlisted',
			},
			{
				name: 'In Campaign',
				value: 'in_campaign',
			},
			{
				name: 'Completed',
				value: 'completed',
			},
			{
				name: 'Rejected',
				value: 'rejected',
			},
		],
		default: '',
		noDataExpression: false,
	},
];

const displayOptions = {
	show: {
		operation: ['moveCandidatesToSpecificStage'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const project_id = this.getNodeParameter('project', 0, '');
		const candidate = this.getNodeParameter('candidate', 0, '');

		const stage = this.getNodeParameter('stage', 0) as string;

		const payload: IDataObject = {
			candidates: [candidate],
			stage: stage,
		};

		const responseData = await apiRequest.call(
			this,
			'POST',
			`/api/project/${project_id}/pipeline/candidates/change-stage`,
			payload,
		);

		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData),
			{ itemData: { item: 0 } },
		);
		returnData.push(...executionData);
	} catch (error) {
		if (this.continueOnFail()) {
			returnData.push({ json: { message: error.message, error } });
		}
		throw error;
	}

	return returnData;
}
