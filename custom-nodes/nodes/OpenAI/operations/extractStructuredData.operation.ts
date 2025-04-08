import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';

import { openaiApiRequest } from '../openaiApiRequest';

/* -------------------------------------------------------------------------- */
/*                                openai:extractStructuredData                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		default: 'gpt-4o-mini',
		description: '',
		typeOptions: {
			loadOptionsMethod: 'getOpenAIModels',
		},
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: 'Extract the following data from the provided text',
		description: 'Extract the following data from the provided text',
	},
	{
		displayName: 'Unstructured Text',
		name: 'unstructured_text',
		type: 'string',
		default: '',
		description: '',
	},
	{
		displayName: 'Data Definition',
		name: 'data_definition',
		type: 'fixedCollection',
		typeOptions: {
			sortable: true,
			multipleValues: true,
		},
		placeholder: 'Add Item',
		default: { values: [{ content: '' }] },
		options: [
			{
				displayName: 'Values',
				name: 'values',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						description:
							'Provide the name of the value you want to extract from the unstructured text. The name should be unique and short.',
						default: '',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						description: 'Brief description of the data, this hints for the AI on what to look for',
						default: '',
						typeOptions: {
							rows: 2,
						},
					},
					{
						displayName: 'Data Type',
						name: 'type',
						type: 'options',
						description: 'Type of parameter.',
						options: [
							{
								name: 'Text',
								value: 'string',
							},
							{
								name: 'Number',
								value: 'number',
							},
							{
								name: 'Boolean',
								value: 'boolean',
							},
						],
						default: 'string',
					},
					{
						displayName: 'Fail if Not present?',
						name: 'required',
						type: 'boolean',
						default: false,
					},
				],
			},
		],
	},
];

const displayOptions = {
	show: {
		operation: ['extractStructuredData'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const model = this.getNodeParameter('model', 0) as string;
		const prompt = this.getNodeParameter('prompt', 0) as string;
		const text = this.getNodeParameter('unstructured_text', 0) as string;
		const data_definition = this.getNodeParameter('data_definition.values', 0) as {
			name: string;
			type: string;
			description: string;
			required: boolean;
		}[];

		const parameters: Record<string, unknown> = {};
		const requiredParameters: string[] = [];

		for (const param of data_definition) {
			parameters[param.name] = {
				type: param.type,
				description: param.description ?? param.name,
			};
			if (param.required) {
				requiredParameters.push(param.name);
			}
		}

		const body: IDataObject = {
			model: model,
			messages: [{ role: 'user', content: text }],
			tools: [
				{
					type: 'function',
					function: {
						name: 'extract_structured_data',
						description: prompt,
						parameters: {
							type: 'object',
							properties: parameters,
							required: requiredParameters,
						},
					},
				},
			],
		};

		const responseData = await openaiApiRequest.call(this, 'POST', '/v1/chat/completions', body);

		const toolCallsResponse = responseData.choices[0].message.tool_calls;
		if (toolCallsResponse) {
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(JSON.parse(toolCallsResponse[0].function.arguments)),
				{ itemData: { item: 0 } },
			);

			returnData.push(...executionData);
		} else {
			throw new Error(
				JSON.stringify({
					message: "OpenAI couldn't extract the fields from the above text.",
				}),
			);
		}
	} catch (error) {
		if (this.continueOnFail()) {
			returnData.push({ json: { message: error.message, error } });
		}
		throw error;
	}

	return returnData;
}
