import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { authProperties, projectProperties, workspaceProperties } from '../common.descriptions';
import { loadOptions, resourceMapping, webhookMethods } from '../methods';

export class WhatsappTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whatsapp Trigger',
		name: 'whatsappTrigger',
		icon: 'file:whatsapp.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle Whatsapp events via webhooks',
		defaults: {
			name: 'Whatsapp Trigger',
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
			...workspaceProperties,
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
						name: 'Message Replied',
						value: 'whatsapp.message.replied',
						description: 'Occurs whenever a candidate replied to any message',
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
