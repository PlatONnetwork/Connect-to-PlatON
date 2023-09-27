import { defineConfig, transformerVariantGroup, transformerDirectives } from 'unocss'

export default defineConfig({
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'flex-around': 'flex justify-around items-center',
    'flex-start': 'flex justify-start items-center',
  },
  theme: {
    breakpoints: {
      sm: '320px',
      md: '640px',
    },
    colors: {
      gray: '#999',
    },
  },
  rules: [
    ['b-base', { border: '1px solid #333' }],
    ['font-b', { 'font-family': 'Gilroy-Bold' }],
    ['font-m', { 'font-family': 'Gilroy-Medium' }],
    ['font-r', { 'font-family': 'Gilroy-regular' }],
    ['font-l', { 'font-family': 'Gilroy-light' }],
    [
      'btn',
      {
        'font-family': 'Gilroy-Medium',
        'font-size': '14px',
        cursor: 'pointer',
        'text-align': 'center',
        height: '40px',
        'line-height': '40px',
        width: '140px',
      },
    ],
    ['w-btn', { color: '#000', 'background-color': '#fff' }],
    ['b-btn', { color: '#fff', 'background-color': '#000', border: '1px solid #fff' }],
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
