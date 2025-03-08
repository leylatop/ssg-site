# README

## dev
```
npx @11ty/eleventy --serve
```

## build
```
npx @11ty/eleventy
```

## use 

### use filter
1. 可以在 `.eleventy.js`文件中配置`过滤器`，
  - 同步`过滤器`api: `addFilter`
  - 异步`过滤器`api: `addAsyncFilter`

2. 在njk中引用时，用`{{}}`包裹

```njk
 <p>{{ "now2" | myFilter }}</p>
```

### use shortcode

1. 可以在 `.eleventy.js`文件中配置`代码片段`，
  - 同步`代码片段` api `addShortcode`
  - 异步`代码片段` api `addAsyncShortcode`
  - 成对`代码片段` api `addPairedShortcode`，`addPairedAsyncShortcode`

2. 在njk中引用时，用`{% %}`包裹
```njk
{% user "Zach Leatherman", "zachleat" %} 

{% userUniversal "Zach Leatherman", "zachleat" %} 
  Zach likes to take long walks on Nebraska beaches. 
{% enduserUniversal %} 

{% user3 name="Zach Leatherman", twitter="zachleat" %}

```

## 注意事项
- 本地开发时，在 `.eleventy.js`文件增加`过滤器`、`代码片段`后，需要重新运行`npx @11ty/eleventy --serve`命令，否则在使用时会报错
```
eleventyConfig.addAsyncFilter("asyncFilter2", async (date) => {
    return "hello world";
  });
```


