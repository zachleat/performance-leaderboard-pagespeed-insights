const PerfLeaderboard = require("../.");

(async function() {
	let urls = [
		"https://www.gatsbyjs.com/",
		"https://www.11ty.dev/",
		// "https://nextjs.org/",
		// "https://vuejs.org/",
		// "https://reactjs.org/",
		// "https://jekyllrb.com/",
		// "https://nuxtjs.org/",
		// "https://gridsome.org/",
		// "https://svelte.dev/",
		// "https://gohugo.io/",
		// "https://redwoodjs.com/",
	];

	let finalResults = await PerfLeaderboard(urls, {
		// beforeHook: function(url) {
		// 	console.log( "hi to ", url );
		// },
		// afterHook: function(result) {
		// 	console.log( result );
		// }
	});
	console.log( finalResults );
})();
