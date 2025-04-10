import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import * as tidyhire from './operations';
import { authProperties } from '../common.descriptions';
import { loadOptions, resourceMapping } from '../methods';
import { router } from '../router';

export class Tidyhire implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tidyhire',
		description: 'Consume the tidyhire API',
		name: 'tidyhire',
		icon: 'file:tidyhire.svg',
		group: ['transform'],
		subtitle: '={{"Tidyhire: " + $parameter["operation"]}}',
		version: 1,
		defaults: {
			name: 'Tidyhire',
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
		properties: [...authProperties, ...tidyhire.description],
	};
	methods = {
		loadOptions,
		resourceMapping,
	};

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
