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
/*                                whatsapp:sendTemplate                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	...whatsappBusinessAccountProperties,
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
		displayName: 'Template Variables',
		name: 'templateVariables',
		type: 'resourceMapper',
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		noDataExpression: true,
		required: true,
		typeOptions: {
			loadOptionsDependsOn: ['templateId'],
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
		operation: ['sendTemplate'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

function transformMapper(input: IDataObject): IDataObject {
	let output: IDataObject = {
		header:[],
		body:[]
	};

	for (let key in input) {
		let match = key.match(/(header|body)-{{(\d+)}}/);
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
		const project_id = this.getNodeParameter('project', 0, '');
		const candidate_id = this.getNodeParameter('candidate', 0, '');
		const candidate_phone = this.getNodeParameter('candidatePhoneNumber', 0, '');

		const template_id = this.getNodeParameter('templateId', 0, '');

		const dataMode = this.getNodeParameter('templateVariables.mappingMode', 0) as string;

		const body: IDataObject = {
			template_id: template_id,
			candidate_id: candidate_id,
			candidate_phone_number: candidate_phone,
			project_id: project_id,
		};

		if (dataMode === 'defineBelow') {
			const template_variables = this.getNodeParameter(
				'templateVariables.value',
				0,
				[],
			) as IDataObject;
			body.template_variables = transformMapper(template_variables);
		}

		console.log(body);

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
