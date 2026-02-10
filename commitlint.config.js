export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 修改 header（第一行）最大长度，默认是 100
    'header-max-length': [2, 'always', 200],
    // 修改 body 每行最大长度，默认是 100
    'body-max-line-length': [2, 'always', 200],
    // 修改 footer 每行最大长度，默认是 100
    'footer-max-line-length': [2, 'always', 200]
  }
}
