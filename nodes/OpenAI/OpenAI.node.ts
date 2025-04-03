import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import * as openai from './operations';
import { loadOptions, resourceMapping } from '../methods';
import { router } from '../router';

export class OpenAI implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenAI',
		description: 'Consume the openai API',
		name: 'openai',
		icon: 'file:openai.svg',
		group: ['transform'],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resources"]}}',
		version: 1,
		defaults: {
			name: 'OpenAI',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'openAIApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'hidden',
				default: 'openAIApi',
			},
			...openai.description,
		],
	};
	methods = {
		loadOptions,
		resourceMapping,
	};

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
