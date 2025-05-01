import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { authProperties, projectProperties } from '../common.descriptions';
import { listSearch, loadOptions, resourceMapping, webhookMethods } from '../methods';

export class AICallTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AI Call Trigger',
		name: 'AICallTrigger',
		icon: 'file:ria.png',
		group: ['trigger'],
		version: 1,
		description: 'Handle AI Cal events via webhooks',
		defaults: {
			name: 'AI Call Trigger',
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
						value: '*',
						description: 'Any time any event is triggered (Wildcard Event)',
					},
					{
						name: 'Call Ended',
						value: 'call.ended',
						description: 'Occurs whenever a call is ended',
					},
				],
			},
		],
	};

	methods = {
		loadOptions,
		listSearch,
		resourceMapping,
	};

	webhookMethods = {
		default: webhookMethods,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return webhookMethods.execute.call(this);
	}
}
