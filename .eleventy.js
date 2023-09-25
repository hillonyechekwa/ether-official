


module.exports = function(eleventyConfig){
	eleventyConfig.addPassthroughCopy('./src/assets')
	eleventyConfig.addPassthroughCopy('./src/favicon')
	eleventyConfig.addPassthroughCopy('./src/scripts')
	eleventyConfig.addWatchTarget('./src/scss/')
	return{
		dir: {
			input: "src",
			output: "dist"
		}
	}
}