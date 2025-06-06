import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties, NodeOperationError,
	updateDisplayOptions,
} from 'n8n-workflow';
import { projectProperties } from '../../common.descriptions';

/* -------------------------------------------------------------------------- */
/*                                tidyhire:moveCandidatesToSpecificStage                             */
/* -------------------------------------------------------------------------- */
import settingsOptions from '../settingsOptions.json';
import { apiRequest } from '../../apiRequest';

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
		displayName: 'First Message',
		name: 'firstMessage',
		type: 'string',
		default: 'Hello',
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
				default: '',
			},
			{
				displayName: 'Language Provider Name or ID',
				name: 'languageProvider',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getLanguageProviders',
					loadOptionsDependsOn: ['assistantSettings.language'],
				},
				default: '',
			},
			{
				displayName: 'LLM',
				name: 'llm',
				type: 'options',
				options: settingsOptions.llmModel.map((each) => ({
					name: each.label,
					value: JSON.stringify({ provider:each.provider, model: each.value }),
					description: each.provider,
				})),
				default: '',
				noDataExpression: true,
			},
			{
				displayName: 'LLM Temperature',
				name: 'llmTemperature',
				type: 'number',
				default: 0.7,
			},
			{
				displayName: 'Ambience Sound Effect',
				name: 'effect',
				type: 'options',
				options: settingsOptions.effect.map((each) => ({
					name: each,
					value: each,
				})),
				default: '',
			},
			{
				displayName: 'Effect Volume',
				name: 'effectVolume',
				type: 'number',
				default: 0.3,
			},
			{
				displayName: 'Voice',
				name: 'tts',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getVoices',
					loadOptionsDependsOn: ['assistantSettings.language', 'assistantSettings.gender'],
				},
				default: '',
				noDataExpression: true,
			},
			{
				displayName: 'Voice Speed',
				name: 'voiceSpeed',
				type: 'number',
				default: -0.3,
			},
		],
	},
	{
		displayName: 'Call Settings',
		name: 'callSettings',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		options: [
			{
				displayName: 'Retry Intervals',
				name: 'retryIntervals',
				type: 'fixedCollection',
				typeOptions: {
					sortable: true,
					multipleValues: true,
				},
				placeholder: 'Add a Retry',
				default: { values: [] },
				options: [
					{
						displayName: 'Values',
						name: 'values',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'Delay',
										value: 'delay',
									},
									{
										name: 'Specific Date & Time',
										value: 'specific_datetime',
									},
								],
								default: 'delay',
							},
							{
								displayName: 'Unit',
								name: 'unit',
								type: 'options',
								options: [
									{
										name: 'Minutes',
										value: 'minutes',
									},
									{
										name: 'Hours',
										value: 'hours',
									},
									{
										name: 'Days',
										value: 'days',
									},
								],
								default: 'hours',
								displayOptions: {
									show: {
										type: ['delay'],
									},
								},
							},
							{
								displayName: 'Amount',
								name: 'amount',
								type: 'number',
								default: 1,
								displayOptions: {
									show: {
										type: ['delay'],
									},
								},
							},
							{
								displayName: 'Date & Time',
								name: 'dateTime',
								type: 'dateTime',
								default: '',
								displayOptions: {
									show: {
										type: ['specific_datetime'],
									},
								},
							},
						],
					},
				],
			},
			{
				displayName: 'Retry if Call Is',
				name: 'retryConditions',
				type: 'multiOptions',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: 'Missed',
						value: 'missed',
					},
					{
						name: 'Declined',
						value: 'declined',
					},
					{
						name: 'Reached to Voicemail',
						value: 'sent_to_voicemail',
					},
					{
						name: 'Silenced',
						value: 'silenced',
					},
					{
						name: 'Abruptly Disconnected',
						value: 'abruptly_disconnected',
					},
				],
				typeOptions: {
					loadOptionsDependsOn: ['callSettings.isRetry'],
				},
				default: ['missed', 'declined', 'sent_to_voicemail', 'silenced', 'abruptly_disconnected'],
			},
		],
	},
	{
		displayName: 'Post Call Analysis',
		name: 'postCallAnalysis',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		options: [
			{
				displayName: 'Post Call Data Retrieval',
				name: 'structuredDataPlan',
				type: 'fixedCollection',
				typeOptions: {
					sortable: true,
					multipleValues: true,
				},
				placeholder: 'Add Field',
				default: { values: [] },
				options: [
					{
						displayName: 'Values',
						name: 'values',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
								options: [
									{
										name: 'Text',
										value: 'text',
									},
									{
										name: 'Single Select',
										value: 'single_select',
									},
									{
										name: 'Boolean',
										value: 'boolean',
									},
									{
										name: 'Number',
										value: 'number',
									},
									{
										name: 'Array',
										value: 'array',
									},
								],
								default: 'text',
							},
							{
								displayName: 'Label',
								name: 'label',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								typeOptions: {
									rows: 3,
								},
							},
							{
								displayName: 'Format Example',
								name: 'format_example',
								type: 'string',
								default: '',
								displayOptions: {
									show: {
										type: ['text', 'number', 'array'],
									},
								},
							},
							{
								displayName: 'Choices',
								name: 'choices',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								placeholder: 'Add Choice',
								default: { items: [] },
								displayOptions: {
									show: {
										type: ['single_select'],
									},
								},
								options: [
									{
										displayName: 'Items',
										name: 'items',
										values: [
											{
												displayName: 'Choice',
												name: 'choice',
												type: 'string',
												default: '',
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: 'Post Call Summary',
				name: 'summaryPlan',
				type: 'string',
				default: '',
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

		const project = this.getNodeParameter('project', 0, undefined, {
			extractValue: true,
		});

		const phone = this.getNodeParameter('candidatePhoneNumber', 0, '', { extractValue: true });
		const instructions = this.getNodeParameter('instructions', 0, '') as string;
		const first_message = this.getNodeParameter('firstMessage', 0, '') as string;
		const assistantSettings = this.getNodeParameter('assistantSettings', 0, {}) as any;
		const callSettings = this.getNodeParameter('callSettings', 0, {}) as any;
		const postCallAnalysis = this.getNodeParameter('postCallAnalysis', 0, {}) as any;

		let retry_intervals = [];

		// Handle Retry Intervals
		if (callSettings.retryIntervals?.values?.length) {
			retry_intervals = callSettings.retryIntervals.values.map((r: any) => {
				const interval: any = { type: r.type };
				if (r.type === 'delay') {
					interval.unit = r.unit;
					interval.amount = r.amount;
				} else if (r.type === 'specific_datetime') {
					interval.dateTime = r.dateTime;
				}
				return interval;
			});
		}

		let structured_data_plan = null;

		// Post-Call Analysis: Structured Data Plan
		if (postCallAnalysis.structuredDataPlan?.values?.length) {
			structured_data_plan = postCallAnalysis.structuredDataPlan.values.map((item: any) => {
				const structured = {
					type: item.type,
					label: item.label,
					description: item.description,
				} as any;

				if (['text', 'number', 'array'].includes(item.type)) {
					structured.format_example = item.format_example;
				}

				if (item.type === 'single_select' && item.choices?.items?.length) {
					structured.choices = item.choices?.items?.length
						? item.choices.items.map((c: any) => c.choice)
						: [];
				}

				return structured;
			});
		}

		let llm=assistantSettings.llm
		let tts=assistantSettings.tts


		if(llm){
			llm=JSON.parse(llm);
		}

		if(tts){
			tts=JSON.parse(tts);
		}
		const payload: Record<string, any> = {
			to: [{ id: candidate, phone: phone }],
			project_id: project,
			instructions: instructions,
			first_message: first_message,
			summary_plan: postCallAnalysis.summaryPlan,
			structured_data_plan: structured_data_plan,
			assistant_settings: {
				gender:assistantSettings.gender,
				language:{
					code: assistantSettings.language,
					provider: assistantSettings.languageProvider,
				},
				llm:{
				...llm,
					temperature:assistantSettings.llmTemperature,
				},
				tts:{
					...tts,
					speed:assistantSettings.voiceSpeed,
				}
			},
			call_settings: {
				retry_policy: {
					intervals: retry_intervals,
					Conditions: callSettings?.retryConditions || [],
				},
				whatsapp_notifications: {
					missed: {
						notify: false,
						message: '',
					},
					declined: {
						notify: false,
						message: '',
					},
					sent_to_voicemail: {
						notify: false,
						message: '',
					},
					silenced: {
						notify: false,
						message: '',
					},
					abruptly_disconnected: {
						notify: false,
						message: '',
					},
				},
			},
		};



		const responseData = await apiRequest.call(
			this,
			'POST',
			`/api/communication/ai-call/start`,
			payload,
		);

		if (responseData?.success) {
			const items = [];
			if (responseData.success) {
				items.push({ json: responseData?.data });
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
