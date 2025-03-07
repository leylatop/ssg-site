module.exports = function (eleventyConfig) {
  // 复制静态资源
  eleventyConfig.addPassthroughCopy("src/css");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};