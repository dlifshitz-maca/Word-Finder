
enyo.kind
(
	{
		name: "MyApps.WordGenerator",
		minLen: 3, // FIXME: get rid of hardcoding?
		words: [],
		dictionary: undefined,
		parent: undefined,
		onProgress: undefined,
		onFinish: undefined,
		letters: undefined,
		lettersCharNums: undefined,
		numWords: 0,
		increment: 0,
		fromIndex: 0,
		toIndex: 0,
		init: function(dictionary, parent, onProgress, onFinish)
		{
			this.dictionary = dictionary;
			this.parent = parent;
			this.onProgress = onProgress;
			this.onFinish = onFinish;
		},
		start: function(letters)
		{
			this.letters = letters;
			this.lettersCharNums = this.dictionary.calcWordCharNums(letters);
			enyo.log("letters:", letters);
			enyo.log("lettersCharNums:", this.lettersCharNums);

			this.words = [];

			this.numWords = this.dictionary.wordsArray.length;
			this.increment = Math.floor(this.numWords / 100);
			this.fromIndex = 0;
			this.toIndex = -1;// TODO: check: should be 0 or -1 (probably -1 so fromIndex becomes 0 on first run)
			
			/*MainAssistant.answersTextField.mojo.setValue("Finding...");
			this.controller.get('scroller1').mojo.scrollTo(undefined, 0);*/

			var len = this.letters.length;
			if(len < this.minLen)
			{
				enyo.log("bad number of letters:", len);
				enyo.asyncMethod(this.parent, this.onFinish);
				return;
			}

			enyo.asyncMethod(this, this.findWorker);
		},
		findWorker: function()
		{
			this.fromIndex = this.toIndex + 1;
			if(this.fromIndex >= this.numWords)
			{
				enyo.asyncMethod(this.parent, this.onFinish);
				return;
			}
			enyo.asyncMethod(this.parent, this.onProgress, Math.floor(100 * this.fromIndex / this.numWords));
			this.toIndex = this.fromIndex + Math.min(this.increment, this.numWords - this.fromIndex - 1);
			this.findWords(this.letters, this.lettersCharNums, this.minLen, this.fromIndex, this.toIndex);
			enyo.asyncMethod(this, this.findWorker);
		},
		/*
		// Use this findWords instead to generate the wordsCharNumsArray_zeroed file
		findWords: function(letters, lettersCharNums, minLen, fromIndex, toIndex)
		{
			var words = this.dictionary.wordsArray;
			var wordsCharNumsArray = this.dictionary.wordsCharNumsArray;
			for(var i = fromIndex; i <= toIndex; i++)
			{
				var word = words[i];
				var wordCharNumsArray = wordsCharNumsArray[i];
				for(var j = 0; j < word.length - 1; j++)
				{
					var c = word.charAt(j);
					var anotherIndex = word.indexOf(c, j + 1);
					if(anotherIndex != -1)
					{
						wordCharNumsArray =
							wordCharNumsArray.substring(0, anotherIndex)
							+ '0'
							+ wordCharNumsArray.substring(anotherIndex + 1);
					}
				}
				this.words.push(wordCharNumsArray);
			}
		},*/
		findWords: function(letters, lettersCharNums, minLen, fromIndex, toIndex)
		{
			//enyo.log("find from", fromIndex, "to", toIndex);
			var words = this.dictionary.wordsArray;
			var wordsCharNumsArray = this.dictionary.wordsCharNumsArray;
			for(var i = fromIndex; i <= toIndex; i++)
			{
				var word = words[i];
				if(word.length < minLen || word.length > letters.length)
				{
					continue;
				}
				var wordCharNumsArray = wordsCharNumsArray[i];
				var valid = true;
				var availableBlanks = lettersCharNums.blanks;
				for(var j = 0; j < word.length; j++)
				{
					var c = word.charAt(j);
					var numMissingChars = wordCharNumsArray.charAt(j) - lettersCharNums[c];
					if(numMissingChars > 0)
					{
						if(numMissingChars > availableBlanks)
						{
							valid = false;
							break;
						}
						else
						{
							availableBlanks -= numMissingChars;
						}
					}
				}
				if(valid)
				{
					this.words.push(word);
				}
			}
		},
	}
);
