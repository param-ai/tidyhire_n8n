import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { authProperties, projectProperties } from '../common.descriptions';
import { loadOptions, resourceMapping, webhookMethods } from '../methods';

export class TidyhireTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tidyhire Trigger',
		name: 'tidyhireTrigger',
		icon: 'file:tidyhire.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle Tidyhire events via webhooks',
		defaults: {
			name: 'Tidyhire Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'tidyhireApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			...authProperties,
			...projectProperties,
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The event to listen to',
				options: [
					{
						name: '*',
						value: 'tidyhire.*',
						description: 'Any time any event is triggered (Wildcard Event)',
					},
					{
						name: 'Project Created',
						value: 'tidyhire.project.created',
						description: 'Occurs whenever a user created a project',
					},
				],
			},
		],
	};

	methods = {
		loadOptions,
		resourceMapping,
	};

	webhookMethods = {
		default: webhookMethods,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return webhookMethods.execute.call(this);
	}
}
