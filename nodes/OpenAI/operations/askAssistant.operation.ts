import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';

import OpenAI from 'openai';

// import { openaiApiRequest } from '../openaiApiRequest';

/* -------------------------------------------------------------------------- */
/*                                openai:askAssistant                             */
/* -------------------------------------------------------------------------- */

const displayOptions = {
	show: {
		operation: ['askAssistant'],
	},
};

const properties: INodeProperties[] = [
	{
		displayName: 'Assistant',
		name: 'assistant',
		type: 'options',
		default: '',
		description: 'The assistant which will generate the completion.',
		typeOptions: {
			loadOptionsMethod: 'getOpenAIAssistants',
		},
	},
	{
		displayName: 'Question',
		name: 'question',
		type: 'string',
		default: '',
	},
];

export const description = updateDisplayOptions(displayOptions, properties);

const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const assistant = this.getNodeParameter('assistant', 0) as string;
		const question = this.getNodeParameter('question', 0) as string;

		const credential = await this.getCredentials('openAIApi');

		const openai = new OpenAI(credential);

		const thread = await openai.beta.threads.create();

		const message = await openai.beta.threads.messages.create(thread.id, {
			role: 'user',
			content: question,
		});

		let response: any;
		const runCheckDelay = 1000;

		const run = await openai.beta.threads.runs.create(thread.id, {
			assistant_id: assistant,
		});

		// Wait at least 400ms for inference to finish before checking to save requests
		await sleep(400);

		while (!response) {
			const runCheck = await openai.beta.threads.runs.retrieve(thread.id, run.id);
			if (runCheck.status == 'completed') {
				const messages = await openai.beta.threads.messages.list(thread.id);
				// Return only messages that are newer than the user's latest message
				response = messages.data.splice(
					0,
					messages.data.findIndex((m) => m.id == message.id),
				);
				break;
			}

			await sleep(runCheckDelay);
		}

		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(response),
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
