import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	NodeOperationError,
	updateDisplayOptions,
} from 'n8n-workflow';
import { candidateProperties, projectProperties } from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                tidyhire:getCandidateDetails                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	{ ...projectProperties, ...candidateProperties[0], required: true },
];

const displayOptions = {
	show: {
		operation: ['getCandidateDetails'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const candidate = this.getNodeParameter('candidate', 0, '', {
			extractValue: true,
		});

		const responseData = await apiRequest.call(this, 'GET', `/api/candidate/${candidate}`);

		if (responseData?.success) {
			const items = [];
			if (responseData.success) {
				items.push({ json: responseData.data?.data });
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
