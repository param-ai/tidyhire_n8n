import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	NodeOperationError,
	updateDisplayOptions,
} from 'n8n-workflow';
import { projectProperties } from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                tidyhire:getCandidates                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...projectProperties,
	{
		displayName: 'Stage',
		name: 'stages',
		type: 'multiOptions',
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
		default: ['shortlisted', 'in_campaign'],
		hint: 'Get candidates by Stage',
		noDataExpression: false,
	},
];

const displayOptions = {
	show: {
		operation: ['getCandidatesByStage'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const project_id = this.getNodeParameter('project', 0, '', {
			extractValue: true,
		});

		const stages = this.getNodeParameter('stages', 0) as string[];

		const payload: IDataObject = {
			filter: {
				stage_ids: stages,
			},
		};

		const responseData = await apiRequest.call(
			this,
			'POST',
			`/api/project/${project_id}/pipeline/candidates?no_limit=true`,
			payload,
		);

		if (responseData?.success) {
			const items = [];
			if (responseData.success && Array.isArray(responseData.data?.candidates)) {
				for (const candidate of responseData.data?.candidates) {
					items.push({ json: candidate });
				}
			}
			returnData.push(...items);
		} else {
			throw new NodeOperationError(this.getNode(), responseData?.message);
		}
	} catch (error) {
		if (this.continueOnFail()) {
			returnData.push({ json: { message: error.message, error } });
		}
		throw error;
	}

	return returnData;
}
