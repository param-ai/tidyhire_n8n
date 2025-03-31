import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import * as email from './Email.resource';


export class Email implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Email',
		description: 'Consume the email API',
		name: 'email',
		icon: 'fa:envelope',
		group: ['output'],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resources"]}}',
		version: 1,
		defaults: {
			name: 'Email',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'tidyhireApi',
				required: true,
			},
		],
		properties: [
			...email.description,
		],
	};
}
