enyo.kind
(
	{
		name: "MyApps.WordFinder",
		//kind: "FittableRows",
		classes: "onyx",
		components:
		[
			{
				kind: "onyx.Toolbar",
				components:
				[
					{
						kind: "onyx.InputDecorator",
						components:
						[
							{
								kind: "onyx.Input",
								name: "lettersInput", 
								placeholder: "Find words",
								onkeydown: "findOnEnter",
								defaultFocus: true,
							},
							{
								kind: "Image",
								src: "search-input-search.png",
								ontap: "findWords",
							},
						],
					},
				],
			},
			{
				tag: "div",
				name: "answers"
			},
			/*{
				kind: "enyo.Scroller",
				fit: true,
				components:
				[
					{
						tag: "div",
						name: "answers",
					},
				],
			},*/
			/*{
				kind: "enyo.Scroller",
				fit: true,
				name: "answers"
			},*/
		],
		dictionary: undefined,
		wordGenerator: undefined,
		init: function()
		{
			this.dictionary = new MyApps.Dictionary();
			this.dictionary.init();

			this.wordGenerator = new MyApps.WordGenerator();
			this.wordGenerator.init(this.dictionary, this, this.onProgress, this.onFinish);
		},
		findOnEnter: function(inSender, inEvent)
		{
			if(inEvent.keyCode === 13)
			{
				this.findWords();
				return true;
			}
		},
		findWords: function()
		{
			// TODO: MainAssistant.answersTextField.mojo.setValue("Finding...");
			// TODO: this.controller.get('scroller1').mojo.scrollTo(undefined, 0);
			var letters = this.$.lettersInput.getValue();
			this.wordGenerator.start(letters);
		},
		onProgress: function(percent)
		{
			this.$.answers.destroyClientControls();
			this.createComponent
			(
				{
					content: "Finding... " + percent + "%",
					container: this.$.answers,
				}
			);
			this.$.answers.render();
		},
		onFinish: function()
		{
			this.$.answers.destroyClientControls();
			var words = this.wordGenerator.words;
			enyo.log("found", words.length, "words");
			if(words.length > 0)
			{
				this.createComponent
				(
					{
						content: "Found " + words.length + " words:",
						container: this.$.answers,
					}
				);

				for(var i = 0; i < words.length; i++)
				{
					this.createComponent
					(
						{
							content: words[i],
							container: this.$.answers,
						}
					);
				}
			}
			else
			{
				this.createComponent
				(
					{
						content: "No words found",
						container: this.$.answers,
					}
				);
			}
			this.$.answers.render();
		},
	}
);
