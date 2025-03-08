module.exports = function(eleventyConfig) {
  // 复制静态资源     
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // 添加 Nunjucks 过滤器
  eleventyConfig.addFilter("year", () => {
    return new Date().getFullYear();
  });

  // common filter
  eleventyConfig.addFilter("myFilter", (date) => {
    return "hello world";
  });

  // Nunjucks Filter
	eleventyConfig.addFilter(
		"concatThreeThings",
		function (arg1, arg2, arg3) {
			return arg1 + arg2 + arg3;
		}
	);

  // async filter
  eleventyConfig.addAsyncFilter("asyncFilter", async (date) => {
    return "hello world";
  });
  eleventyConfig.addAsyncFilter("asyncFilter2", async (date) => {
    return "hello world";
  });

  // Universal Shortcodes (Adds to Liquid, Nunjucks, 11ty.js)
  eleventyConfig.addShortcode("user", function(name, twitterUsername) {
    return `<div class="user">
<div class="user_name">${name}</div>
<div class="user_twitter">@${twitterUsername}</div>
</div>`;
  });

   // Universal Shortcodes (Adds to Liquid, Nunjucks, 11ty.js)
   eleventyConfig.addPairedShortcode("userUniversal", function(bioContent, name, twitterUsername) {
    return `<div class="user">
<div class="user_name">${name}</div>
<div class="user_twitter">@${twitterUsername}</div>
<div class="user_bio">${bioContent}</div>
</div>`;
  });

  // Nunjucks Shortcode
	eleventyConfig.addShortcode("user3", function (user) {
		return `<div class="user">
<div class="user_name">${user.name}</div>
${user.twitter ? `<div class="user_twitter">@${user.twitter}</div>` : ""}
</div>`;
	});

  // set 
  eleventyConfig.addShortcode("myShortcode", function () {
    return `hello world===========================`;
  });

  // setAsync
  eleventyConfig.addAsyncShortcode("myAsyncShortcode", async () => {
    return "hello world-----------------------";
  });


  eleventyConfig.addGlobalData("myGlobalData", 33);

  eleventyConfig.addNunjucksGlobal("fortythree", 43);
  // setAsync
  eleventyConfig.addNunjucksGlobal("fortytwo", function () {
		return 42;
	});

  return {
      dir: {
          input: "src",
          output: "_site"
      }
  };
};