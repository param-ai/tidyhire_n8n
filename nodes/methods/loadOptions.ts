import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { apiRequest } from '../apiRequest';
import { openaiApiRequest } from '../OpenAI/openaiApiRequest';
import settingsOptions from '../AICall/settingsOptions.json';

// To get all the workspaces
export async function getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
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
}

// To get all the projects by workspace
export async function getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
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
}

// To get all the candidates in a project pipeline by workspace or project

export async function getCandidates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const project = this.getNodeParameter('project', 0) as string;

	const returnData: INodePropertyOptions[] = [];
	const { data } = await apiRequest.call(
		this,
		'POST',
		`/api/project/${project}/pipeline/candidates?no_limit=true`,
	);

	for (const candidate of data?.candidates) {
		returnData.push({
			name: candidate.full_name,
			description: `ID:${candidate._id}`,
			value: candidate._id,
		});
	}
	return returnData;
}

// To get all the phone numbers of candidate by candidate id

export async function getCandidatesPhoneNumbers(
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
}

// To get connected whatsapp business account
export async function getWhatsappBusinessAccount(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
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
}

// To get all whatsapp business api templates based on phone number
export async function getWhatsappTemplateByWorkspaceAndPhoneNumber(
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
}

// To get all whatsapp business api templates based on phone number
export async function getOpenAIModels(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const { data } = await openaiApiRequest.call(this, 'GET', '/v1/models');

	for (const model of data) {
		returnData.push({
			name: model.id,
			value: model.id,
		});
	}

	return returnData;
}

export async function getOpenAIAssistants(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const { data } = await openaiApiRequest.call(
		this,
		'GET',
		'/v1/assistants',
		undefined,
		undefined,
		undefined,
		{
			headers: {
				'OpenAI-Beta': 'assistants=v2',
			},
		},
	);

	for (const model of data) {
		returnData.push({
			name: model?.name || 'Untitled assistant',
			value: model.id,
			description: 'Id: ' + model.id,
		});
	}

	return returnData;
}

// To get all whatsapp business api templates based on phone number
export async function getLanguageProviders(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];

	const language = this.getNodeParameter('assistantSettings.language', 0, {
		extractValue: true,
	});

	if (!language) {
		return [];
	}

	const languageEntry = settingsOptions.language.find((lang) => lang.code === language);


	if (!languageEntry) {
		return [];
	}

	for (const each of languageEntry.supported_provider) {
		returnData.push({
			name: each,
			value: each,
		});
	}
	console.log(returnData);

	return returnData;
}
