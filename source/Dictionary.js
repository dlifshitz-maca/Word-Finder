
enyo.kind
(
	{
		name: "MyApps.Dictionary",
		wordsArray: undefined,
		wordsCharNumsArray: undefined,
		init: function()
		{
			var that = this;

			var wordsFilePath = "data/words_sorted.txt";
			var wordsFileAjax = new enyo.Ajax
			(
				{
					url: wordsFilePath,
					method: "GET",
					handleAs: "text",
					respond: function(data)
					{
						that.wordsArray = data.split("\n");
					},
				}
			);
			wordsFileAjax.go();

			var wordsCharNumsArrayFilePath = "data/wordsCharNumsArray_zeroed.txt";
			var wordsCharNumsArrayFileAjax = new enyo.Ajax
			(
				{
					url: wordsCharNumsArrayFilePath,
					method: "GET",
					handleAs: "text",
					respond: function(data)
					{
						that.wordsCharNumsArray = data.split("\n");
					},
				}
			);
			wordsCharNumsArrayFileAjax.go();
		},
		calcWordCharNums: function(word, baseCharNums)
		{
			var charNums = baseCharNums ||
			{
				blanks: 0,
				a: 0, b: 0, c: 0, d: 0, e: 0,
				f: 0, g: 0, h: 0, i: 0, j: 0,
				k: 0, l: 0, m: 0, n: 0, o: 0,
				p: 0, q: 0, r: 0, s: 0, t: 0,
				u: 0, v: 0, w: 0, x: 0, y: 0,
				z: 0,
			};
			for(var i = 0; i < word.length; i++)
			{
				var c = word.charAt(i);
				if(c == ' ')
				{
					charNums.blanks++;
				}
				else
				{
					charNums[c] = charNums[c] + 1;
				}
			}
			return charNums;
		},
		/*
		spellcheck: function(word)
		{
			return this.words[word] !== undefined;
		},
		*/
	}
);
