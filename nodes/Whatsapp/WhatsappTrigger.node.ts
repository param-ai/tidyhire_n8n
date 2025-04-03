import type {
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionType } from 'n8n-workflow';
import { apiRequest } from '../apiRequest';
import { authProperties, projectProperties, workspaceProperties } from '../common.descriptions';
import { loadOptions, resourceMapping } from '../methods';

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
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
					return false;
				}

				try {
					await apiRequest.call(this, 'GET', '/api/webhook/get/' + webhookData.webhookId);
				} catch (error) {
					if (error.httpCode === '404') {
						// Webhook does not exist
						delete webhookData.webhookId;
						delete webhookData.webhookEvents;
						delete webhookData.webhookSecret;

						return false;
					}

					// Some error occured
					throw error;
				}

				// If it did not error then the webhook exists
				return true;
			},

			async create(this: IHookFunctions): Promise<boolean> {


				const webhookUrl = this.getNodeWebhookUrl('default');

				const events = this.getNodeParameter('events', []);

				const project = this.getNodeParameter('project', null);

				const body = {
					url: webhookUrl,
					events: events,
					workflow_id: this.getWorkflow().id,
					project: project,
				};

				const { data } = await apiRequest.call(this, 'POST', '/api/webhook/create', body);

				if (!data) {
					// Required data is missing so was not successful
					throw new NodeApiError(this.getNode(), data as JsonObject, {
						message: 'Whatsapp webhook creation response did not contain the expected data.',
					});
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = data._id as string;
				webhookData.events = data.events as string[];

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					const body = {};

					try {
						await apiRequest.call(
							this,
							'POST',
							'/api/webhook/delete/' + webhookData.webhookId,
							body,
						);
					} catch (error) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
					delete webhookData.webhookSecret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const req = this.getRequestObject();

		const events = this.getNodeParameter('events', []) as string[];
		const eventType = bodyData.event as string | undefined;


		if (eventType === undefined || (!events.includes('*') && !events.includes(eventType))) {
			// If not eventType is defined or when one is defined but we are not
			// listening to it do not start the workflow.
			return {};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
		};
	}
}
