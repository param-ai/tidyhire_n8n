import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import {
	whatsappBusinessAccountProperties,
} from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                whatsapp:getTemplate                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...whatsappBusinessAccountProperties,
	{
		displayName: 'Template Name',
		name: 'templateName',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getWhatsappTemplateByPhoneNumber',
					searchable: false,
				},
			},
			{
				displayName: 'By Name',
				name: 'name',
				type: 'string',
			},
		],
	},
];

const displayOptions = {
	show: {
		operation: ['getTemplate'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const template_name = this.getNodeParameter('templateName', 0, undefined, {
			extractValue: true,
		}) as string;

		const responseData = await apiRequest.call(
			this,
			'GET',
			'/api/communication/whatsapp-business-api/get-template',
			undefined,
			{
				template_name: template_name,
			},
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
