import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { whatsappBusinessAccountProperties } from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                whatsapp:sendAlert                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...whatsappBusinessAccountProperties,
	{
		displayName: 'Phone Number',
		name: 'candidatePhoneNumber',
		type: 'string',
		default: '',
		required: true,
		description:
			'Recipient’s phone number in international format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
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
	{
		displayName: 'Template Variables',
		name: 'templateVariables',
		type: 'resourceMapper',
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		required: true,
		typeOptions: {
			loadOptionsDependsOn: ['templateName.value', 'templateName'],
			resourceMapper: {
				resourceMapperMethod: 'getVariablesByWhatsappTemplate',
				mode: 'add',
				fieldWords: {
					singular: 'variable',
					plural: 'variables',
				},
				addAllFields: true,
				multiKeyMatch: true,
			},
		},
	},
];

const displayOptions = {
	show: {
		operation: ['sendAlert'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

function transformMapper(input: IDataObject): IDataObject {
	let output: IDataObject = {
		header: [],
		body: [],
		button:[]
	};

	for (let key in input) {
		let match = key.match(/(header|body|button)-{{(\d+)}}/);
		if (match) {
			let type = match[1]; // 'header' or 'body'
			let index = parseInt(match[2], 10) - 1; // Convert to zero-based index
			let value = input[key];

			// Ensure the key exists and is an array
			if (!Array.isArray(output[type])) {
				output[type] = [];
			}

			(output[type] as any[])[index] = value;
		}
	}

	// Replace undefined slots with null
	for (let key in output) {
		output[key] = (output[key] as any[]).map((val) => (val !== undefined ? val : null));
	}

	return output;
}

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const candidate_phone = this.getNodeParameter('candidatePhoneNumber', 0, undefined, {
			extractValue: true,
		}) as string;

		const template_name = this.getNodeParameter('templateName', 0, undefined, {
			extractValue: true,
		}) as string;

		const dataMode = this.getNodeParameter('templateVariables.mappingMode', 0) as string;

		const body: IDataObject = {
			template_name: template_name,
			candidate_phone_number: candidate_phone,
		};

		if (dataMode === 'defineBelow') {
			const template_variables = this.getNodeParameter(
				'templateVariables.value',
				0,
				[],
			) as IDataObject;
			body.template_variables = transformMapper(template_variables);
		}

		const responseData = await apiRequest.call(
			this,
			'POST',
			'/api/communication/whatsapp-business-api/send-alert',
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
