import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import * as aicall from './operations';
import { authProperties } from '../common.descriptions';
import { loadOptions, listSearch, resourceMapping } from '../methods';
import { router } from '../router';

export class AICall implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AI Call',
		description: 'Consume the tidyhire API',
		name: 'AICall',
		icon: 'file:ria.png',
		group: ['transform'],
		subtitle: '={{"Tidyhire: " + $parameter["operation"]}}',
		version: 1,
		defaults: {
			name: 'AI Call',
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
		properties: [...authProperties, ...aicall.description],
	};
	methods = {
		loadOptions,
		listSearch,
		resourceMapping,
	};

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
