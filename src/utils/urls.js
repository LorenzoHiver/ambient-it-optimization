// TODO
export const URL = (process.env.NODE_ENV === 'production' ?
  'https://meetema.herokuapp.com/'
  : 'http://localhost:1337/');

export const URLFront = (process.env.NODE_ENV === 'production' ?
'https://emalight.herokuapp.com/'
: 'http://localhost:3000/');