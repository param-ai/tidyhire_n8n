import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';

import { openaiApiRequest } from '../openaiApiRequest';

/* -------------------------------------------------------------------------- */
/*                                openai:askChatgpt                             */
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
		displayName: 'Question',
		name: 'question',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Temperature',
		name: 'temperature',
		type: 'number',
		default: 0.9,
		description:
			'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
	},
	{
		displayName: 'Maximum Tokens',
		name: 'max_tokens',
		type: 'number',
		default: 2048,
		description:
			"The maximum number of tokens to generate. Requests can use up to 2,048 or 4,096 tokens shared between prompt and completion depending on the model. Don't set the value to maximum and leave some tokens for the input. (One token is roughly 4 characters for normal English text)",
	},
	{
		displayName: 'Top P',
		name: 'top_p',
		type: 'number',
		default: 1,
		description:
			'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.',
	},
	{
		displayName: 'Frequency penalty',
		name: 'frequency_penalty',
		type: 'number',
		default: 0,
		description:
			"Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
	},
	{
		displayName: 'Presence penalty',
		name: 'presence_penalty',
		type: 'number',
		default: 0.6,
		description:
			"Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the mode's likelihood to talk about new topics.",
	},
	{
		displayName: 'Messages',
		name: 'messages',
		type: 'fixedCollection',
		typeOptions: {
			sortable: true,
			multipleValues: true,
		},
		placeholder: 'Add message',
		default: { values: [{ role: 'system', content: 'You are a helpful assistant.' }] },
		options: [
			{
				displayName: 'Values',
				name: 'values',
				values: [
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						options: [
							{
								name: 'System',
								value: 'system',
							},
							{
								name: 'User',
								value: 'user',
							},
							{
								name: 'Assistant',
								value: 'assistant',
							},
						],
						default: 'text',
					},
				],
			},
		],
	},
];

const displayOptions = {
	show: {
		operation: ['askChatgpt'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const model = this.getNodeParameter('model', 0) as string;
		const question = this.getNodeParameter('question', 0) as string;

		const temperature = this.getNodeParameter('temperature', 0) as number;

		const max_tokens = this.getNodeParameter('max_tokens', 0) as number;

		const top_p = this.getNodeParameter('top_p', 0) as number;
		const frequency_penalty = this.getNodeParameter('frequency_penalty', 0) as number;

		const presence_penalty = this.getNodeParameter('presence_penalty', 0) as number;

		const messages = this.getNodeParameter('messages.values', 0) as {
			content: string;
			role: string;
		}[];

		const body: IDataObject = {
			model: model,
			messages: [...messages, { role: 'user', content: question }],
			temperature: temperature,
			top_p: top_p,
			frequency_penalty: frequency_penalty,
			presence_penalty: presence_penalty,
			max_completion_tokens: max_tokens,
		};

		const responseData = await openaiApiRequest.call(this, 'POST', '/v1/chat/completions', body);

		const message = responseData.choices[0].message.content;
		if (message) {
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray({ message }),
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
