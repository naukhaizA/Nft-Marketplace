/* tailwind.config.js */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'b1': "url('https://pixabay.com/get/g1058a5b2648caa3b8e916d1252f415837ce4e48efea011fb5c67b16defe9ed0d2d8ea46d060a97ff300aada9c036f9008a953e520afdcea4c01dd00e1f1ab701bce3787bfcd1f8d09b33a360f0da4373_1920.jpg')",
        'b2': "url('.././images/red-black-brush-stroke-banner-background-perfect-canva.jpg')",
        'b3': "url('.././images/red-black-brush-stroke-banner-background-perfect-canva edited.jpg')",
        'b4': "url('.././images/red-black-brush-stroke-banner-background-perfect-canva edited blur.jpg')",
        'b5': "url('.././images/simple-abstract-wave-background_181182-172.jpg')",
        'b6': "url('.././images/red-black-brush-stroke-banner-background-perfect-canva edited blur2.jpg')",
        'b7': "url('.././images/red-black-brush-stroke-banner-background-perfect-canva white.jpg')",
        'footer-texture': "url('https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
      // }
    },
    backgroundSize: {
      'size-200': '200% 200%',
  },
  backgroundPosition: {
      'pos-0': '0% 0%',
      'pos-100': '100% 100%',
  },
  animation: {
    cursor: 'cursor .6s linear infinite alternate',
    type: 'type 3s ease-out .8s 1 normal both',
    t1: 'type 5s ease-out .8s 1 normal both',
    'type-reverse': 'type 1.8s ease-out 0s infinite alternate-reverse both',
  },
  keyframes: {
    // type: {
    //   '0%': { width: '0ch' },
    //   '3%, 6%': { width: '1ch' },
    //   '7%, 10%': { width: '2ch' },
    //   '11%, 14%': { width: '3ch' },
    //   '15%, 18%': { width: '4ch' },
    //   '19%, 22%': { width: '5ch' },
    //   '23%, 26%': { width: '6ch' },
    //   '27%, 30%': { width: '7ch' },
    //   '31%, 34%': { width: '8ch' },
    //   '35%, 38%': { width: '9ch' },
    //   '39%, 42%': { width: '10ch' },
    //   '43%, 46%': { width: '11ch' },
    //   '47%, 50%': { width: '12ch' },
    //   '51%, 54%': { width: '12ch' },
    //   '55%, 58%': { width: '13ch' },
    //   '61%, 64%': { width: '14ch' },
    //   '65%, 68%': { width: '15ch' },
    //   '69%, 72%': { width: '16ch' },
    //   '73%, 76%': { width: '16ch' },
    //   '77%, 80%': { width: '16ch' },
    //   '81%, 84%': { width: '16ch' },
    //   '84%, 85%': { width: '16ch' },
    //   '86%, 89%': { width: '16ch' },
    //   '90%, 93%': { width: '16ch' },
    //   '94%, 97%': { width: '16ch' },
    //   '98%': { width: '16ch' },
    // },
    type: {
      '0%': { width: '0ch' },
      '3%, 6%': { width: '1ch' },
      '7%, 10%': { width: '2ch' },
      '11%, 14%': { width: '3ch' },
      '15%, 18%': { width: '4ch' },
      '19%, 22%': { width: '5ch' },
      '23%, 26%': { width: '6ch' },
      '27%, 30%': { width: '7ch' },
      '31%, 34%': { width: '8ch' },
      '35%, 38%': { width: '9ch' },
      '39%, 42%': { width: '10ch' },
      '43%, 46%': { width: '11ch' },
      '47%, 50%': { width: '12ch' },
      '51%, 54%': { width: '12ch' },
      '55%, 58%': { width: '13ch' },
      '61%, 64%': { width: '14ch' },
      '65%, 68%': { width: '15ch' },
      '69%, 72%': { width: '16ch' },
      '73%, 76%': { width: '17ch' },
      '77%, 80%': { width: '18ch' },
      '81%, 84%': { width: '19ch' },
      '84%, 85%': { width: '20ch' },
      '86%, 89%': { width: '21ch' },
      '90%, 93%': { width: '22ch' },
      '94%, 97%': { width: '23ch' },
      '98%': { width: '24ch' },
    },
  },
  rotate: {
    '225': '-45deg',
  }
  
  },
  
  plugins: [],
}
}