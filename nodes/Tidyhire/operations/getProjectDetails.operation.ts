import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	NodeOperationError,
	updateDisplayOptions,
} from 'n8n-workflow';
import { projectProperties } from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                tidyhire:getProjectDetails                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...projectProperties,
	{ ...projectProperties[0], required: true },
];

const displayOptions = {
	show: {
		operation: ['getProjectDetails'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const project = this.getNodeParameter('project', 0, '', {
			extractValue: true,
		});

		const responseData = await apiRequest.call(this, 'GET', `/api/project/get/${project}`);

		if (responseData?.success) {
			const items = [];
			if (responseData.success) {
				items.push({ json: responseData?.data });
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
