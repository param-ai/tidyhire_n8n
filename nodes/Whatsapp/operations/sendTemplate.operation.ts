import { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions } from 'n8n-workflow';
import {
	candidatePhoneProperties,
	candidateProperties,
	projectProperties,
} from '../../common.descriptions';
import { whatsappNumberProperties } from '../descriptions';
import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                whatsapp:sendTemplate                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...whatsappNumberProperties,
	...projectProperties,
	...candidateProperties,
	...candidatePhoneProperties,
	{
		displayName: 'Template Name or ID',
		name: 'templateId',
		type: 'options',
		default: '',
		description:
			'The Template you want to send. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getWhatsappTemplateByWorkspaceAndPhoneNumber',
			loadOptionsDependsOn: ['whatsappBusinessAccount'],
		},
	},
	{
		displayName: 'Dynamic Template Fields',
		name: 'dynamicTemplateFields',
		placeholder: 'Add Dynamic Template Fields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Key of the dynamic template field',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value for the field',
					},
				],
			},
		],
	},
];

const displayOptions = {
	show: {
		operation: ['sendTemplate'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const project_id = this.getNodeParameter('project', 0, '');
		const candidate_id = this.getNodeParameter('candidate', 0, '');
		const candidate_phone = this.getNodeParameter('candidatePhoneNumber', 0, '');

		const template_id = this.getNodeParameter('templateId', 0, '');

		const body: IDataObject = {
			template_id: template_id,
			candidate_id: candidate_id,
			candidate_phone_number: candidate_phone,
			project_id: project_id,
		};

		const responseData = await apiRequest.call(
			this,
			'POST',
			'/api/communication/whatsapp-business-api/send-template',
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
