enyo.kind
(
	{
		name: "MyApps.WordFinder",
		kind: "FittableRows",
		classes: "onyx",
		components:
		[
			{
				kind: "onyx.Toolbar",
				layoutKind: "FittableColumnsLayout",
				style: "padding-right: 20px;",
				components:
				[
					{
						kind: "onyx.InputDecorator",
						layoutKind: "FittableColumnsLayout",
						fit: true,
						style: "padding-top: 10px;",
						components:
						[
							{
								kind: "onyx.Input",
								name: "lettersInput",
								placeholder: "Find words",
								fit: true,
								style: "font-size: 20px; text-transform: uppercase;",
								onkeydown: "findOnEnter",
								onkeypress: "filterInput",
								defaultFocus: true,
							},
							{
								kind: "onyx.IconButton",
								src: "search-input-search.png",
								style: "height: 20px; width: 20px;",
								ontap: "findWords",
							},
						],
					},
				],
			},
			{
				kind: "enyo.Scroller",
				fit: true,
				style: "margin: 10px; text-transform: uppercase;",
				name: "answers"
			},
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
		filterInput: function(inSender, inEvent)
		{
			if(inEvent.charCode)
			{
				var c = String.fromCharCode(inEvent.charCode);
				if(c == ' '
					|| (c >= 'A' && c <= 'Z')
					|| (c >= 'a' && c <= 'z'))
				{
					// allow character
				}
				else
				{
					// deny character
					inEvent.preventDefault();
					return false;
				}
			}
		},
		findWords: function()
		{
			// TODO: MainAssistant.answersTextField.mojo.setValue("Finding...");
			// TODO: this.controller.get('scroller1').mojo.scrollTo(undefined, 0);
			var letters = this.$.lettersInput.getValue().toLowerCase();
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
						allowHtml: true,
						content: "Found " + words.length + " words:<br>" + words.join("<br>"),
						container: this.$.answers,
					}
				);
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
