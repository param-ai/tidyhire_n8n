import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { whatsappBusinessAccountProperties } from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                whatsapp:getTemplates       s                      */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [...whatsappBusinessAccountProperties];

const displayOptions = {
	show: {
		operation: ['getTemplates'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const { data } = await apiRequest.call(
			this,
			'GET',
			'/api/communication/whatsapp-business-api/templates',
		);

		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(data),
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
