import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import {
	candidatePhoneProperties,
	candidateProperties,
	projectProperties,
	whatsappBusinessAccountProperties,
} from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                whatsapp:sendSessionMessage                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...whatsappBusinessAccountProperties,
	...projectProperties,
	...candidateProperties,
	...candidatePhoneProperties,
	{
		displayName: 'Reply To',
		name: 'replyMessageId',
		type: 'string',
		default: '',
		hint: 'It should be expression mode',
		noDataExpression: false,
	},
	{
		displayName: 'Text Message',
		name: 'message',
		type: 'string',
		default: '',
	},
];

const displayOptions = {
	show: {
		operation: ['sendSessionMessage'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);


export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const project_id = this.getNodeParameter('project', 0, '');
		const candidate_id = this.getNodeParameter('candidate', 0, '');
		const candidate_phone = this.getNodeParameter('candidatePhoneNumber', 0, '');

		const message = this.getNodeParameter('message', 0, '');

		const body: IDataObject = {
			reply_to: '',
			candidate_id: candidate_id,
			candidate_phone_number: candidate_phone,
			project_id: project_id,
			content: message,
		};

		const responseData = await apiRequest.call(
			this,
			'POST',
			'/api/communication/whatsapp-business-api/send-message',
			body,
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
