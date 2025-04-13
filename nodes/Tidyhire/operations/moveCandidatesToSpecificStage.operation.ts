import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { projectProperties } from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                tidyhire:moveCandidatesToSpecificStage                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...projectProperties,
	{
		displayName: 'Candidate',
		name: 'candidate',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		// description: 'The Airtable Base in which to operate on',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getCandidates',
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
			},
		],
	},
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
		const project_id = this.getNodeParameter('project', 0, undefined, {
			extractValue: true,
		});
		const candidate = this.getNodeParameter('candidate', 0, undefined, {
			extractValue: true,
		});
		const stage = this.getNodeParameter('stage', 0) as string;

		const payload: IDataObject = {
			candidates: [{ _id: candidate }],
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
