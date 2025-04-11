import {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
	INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../apiRequest';

export async function getProjects(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const returnData: INodeListSearchItems[] = [];
	const { data } = await apiRequest.call(this, 'GET', '/api/project/list');

	for (const project of data) {
		returnData.push({
			name: project.name,
			description: `ID:${project._id}`,
			value: project._id,
		});
	}

	return { results: returnData };
}

export async function getCandidates(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const project = this.getNodeParameter('project', undefined, {
		extractValue: true,
	}) as string;

	if (!project) {
		throw new Error('Please select a project first or use "ID" mode.');
	}

	const returnData: INodeListSearchItems[] = [];
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

	return { results: returnData };
}

export async function getCandidatesPhoneNumbers(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const candidate = this.getNodeParameter('candidate', undefined, {
		extractValue: true,
	}) as string;

	if (!candidate) {
		throw new Error('Please select a candidate first or use "ID" mode.');
	}

	const { data } = await apiRequest.call(this, 'GET', `/api/candidate/get/${candidate}`);

	const returnData: INodePropertyOptions[] = [];

	for (const each of data?.contact_info.phone_numbers) {
		returnData.push({
			name: each.number,
			value: each.number,
		});
	}

	return { results: returnData };
}

export async function getWhatsappTemplateByPhoneNumber(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const { data } = await apiRequest.call(
		this,
		'GET',
		'/api/communication/whatsapp-business-api/templates',
	);

	const returnData: INodePropertyOptions[] = [];

	for (const template of data) {
		returnData.push({
			name: template.name,
			description: `Status:${template.status}`,
			value: template.name,
		});
	}

	return { results: returnData, paginationToken: '' };
}
