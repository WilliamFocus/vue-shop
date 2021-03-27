const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push['transform-remove-console']
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
      ...prodPlugins,
      //配置路由懒加载插件
      '@babel/plugin-syntax-dynamic-import'
    ]
  ]
}
