import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import * as whatsapp from './operations';
import { authProperties } from '../common.descriptions';
import { loadOptions, resourceMapping } from '../methods';
import { router } from '../router';

export class Whatsapp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whatsapp',
		description: 'Consume the whatsapp API',
		name: 'whatsapp',
		icon: 'file:whatsapp.svg',
		group: ['transform'],
		subtitle: '={{"Whatsapp: " + $parameter["operation"]}}',
		version: 1,
		defaults: {
			name: 'Whatsapp',
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
		properties: [...authProperties, ...whatsapp.description],
	};
	methods = {
		loadOptions,
		resourceMapping,
	};

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
