import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	NodeOperationError,
	updateDisplayOptions,
} from 'n8n-workflow';
import { projectProperties } from '../../common.descriptions';

import { apiRequest } from '../../apiRequest';

/* -------------------------------------------------------------------------- */
/*                                tidyhire:moveCandidatesToSpecificStage                             */
/* -------------------------------------------------------------------------- */
import settingsOptions from '../settingsOptions.json';

const properties: INodeProperties[] = [
	...projectProperties,
	{
		displayName: 'Candidate',
		name: 'candidate',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		// description: 'The Airtable Base in which to operate on',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getCandidates',
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
			},
		],
	},
	{
		displayName: "Candidate's Phone Number",
		name: 'candidatePhoneNumber',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description:
			'Recipient’s phone number in international format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getCandidatesPhoneNumbers',
					searchable: false,
				},
			},
			{
				displayName: 'By Number',
				name: 'number',
				type: 'string',
			},
		],
	},
	{
		displayName: 'Instructions (Call Prompt)',
		name: 'instructions',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		description: 'Type your prompt here',
	},
	// {
	// 	displayName: 'Options',
	// 	name: 'options',
	// 	type: 'collection',
	// 	placeholder: 'Add option',
	// 	default: {},
	// 	options: [
	// 		{
	// 			displayName: 'Call Later?',
	// 			name: 'isScheduled',
	// 			type: 'boolean',
	// 			default: false,
	// 			description: 'Enable this to schedule the call for a later time',
	// 		},
	// 		{
	// 			displayName: 'Schedule Time',
	// 			name: 'scheduleTime',
	// 			type: 'dateTime',
	// 			default: '',
	// 			description: 'Time to call',
	// 			displayOptions: {
	// 				show: {
	// 					isScheduled: [true],
	// 				},
	// 			},
	// 		},
	// 	],
	// },
	{
		displayName: 'Assistant Settings',
		name: 'assistantSettings',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		options: [
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				options: settingsOptions.gender.map((each) => ({
					name: each,
					value: each,
				})),
				default: '',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: settingsOptions.language.map((each) => ({
					name: each.language,
					value: each.code,
				})),
				default: 'en',
			},
			{
				displayName: 'Language Provider',
				name: 'languageProvider',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLanguageProviders',
					loadOptionsDependsOn: ['assistantSettings.language'],
				},
				default: 'groq',
			},
		],
	},
];

const displayOptions = {
	show: {
		operation: ['startCall'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const candidate = this.getNodeParameter('candidate', 0, undefined, {
			extractValue: true,
		});

		const custom_fields = this.getNodeParameter('custom_fields.values', 0) as {
			key: string;
			value: string;
		}[];

		const payload: {
			custom_fields: { [key: string]: string };
		} = {
			custom_fields: {},
		};

		custom_fields.map((each) => {
			payload.custom_fields[`${each.key}`] = each.value;
		});

		const responseData = await apiRequest.call(
			this,
			'POST',
			`/api/candidate/update-custom-fields/${candidate}`,
			payload,
		);

		if (responseData?.success) {
			const items = [];
			if (responseData.success) {
				items.push({ json: responseData?.data?.custom_fields });
			}
			returnData.push(...items);
		} else {
			throw new NodeOperationError(this.getNode(), responseData?.message);
		}
	} catch (error) {
		if (this.continueOnFail()) {
			returnData.push({ json: { message: error.message, error } });
		}
		throw error;
	}

	return returnData;
}
