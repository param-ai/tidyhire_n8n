import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import * as whatsapp from './Whatsapp.resource';
import { commonProperties } from '../common.descriptions';
import { apiRequest } from '../apiRequest';
import { router } from '../router';

export class Whatsapp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whatsapp',
		description: 'Consume the whatsapp API',
		name: 'whatsapp',
		icon: 'file:whatsapp.svg',
		group: ['transform'],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resources"]}}',
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
		properties: [...commonProperties, ...whatsapp.description],
	};
	methods = {
		loadOptions: {
			async getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { data } = await apiRequest.call(this, 'GET', '/api/workspace/list');

				for (const workspace of data) {
					returnData.push({
						name: workspace.name,
						description: `ID:${workspace._id} (role: ${workspace.role})`,
						value: workspace._id,
					});
				}
				return returnData;
			},
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { data } = await apiRequest.call(this, 'GET', '/api/project/list');

				for (const project of data) {
					returnData.push({
						name: project.name,
						description: `ID:${project._id}`,
						value: project._id,
					});
				}
				return returnData;
			},
			async getCandidates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const project = this.getNodeParameter('project', 0) as string;

				const returnData: INodePropertyOptions[] = [];
				const { data } = await apiRequest.call(
					this,
					'POST',
					`/api/project/${project}/pipeline/candidates`,
				);

				for (const candidate of data?.candidates) {
					returnData.push({
						name: candidate.full_name,
						description: `ID:${candidate._id}`,
						value: candidate._id,
					});
				}
				return returnData;
			},
			async getCandidatesPhoneNumbers(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const candidate = this.getNodeParameter('candidate', 0) as {
					contact_info: {
						phone_numbers: [
							{
								number: string;
							},
						];
					};
				};

				const { data } = await apiRequest.call(this, 'GET', `/api/candidate/get/${candidate}`);

				const returnData: INodePropertyOptions[] = [];

				for (const each of data?.contact_info.phone_numbers) {
					returnData.push({
						name: each.number,
						value: each.number,
					});
				}
				return returnData;
			},
			async getWhatsappAccount(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { data } = await apiRequest.call(
					this,
					'GET',
					'/api/communication/whatsapp-business-api/account/status',
				);

				if (data) {
					returnData.push({
						name: data.number,
						value: data._id,
					});
				}

				return returnData;
			},
			async getWhatsappTemplateByWorkspaceAndPhoneNumber(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { data } = await apiRequest.call(
					this,
					'GET',
					'/api/communication/whatsapp-business-api/templates',
				);

				for (const template of data) {
					returnData.push({
						name: template.name,
						description: `Status:${template.status}`,
						value: template._id,
					});
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
