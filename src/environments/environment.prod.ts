/**
 * See environment.ts for more info.
 * 
 * Set the desired BACKEND before running "ionic build --prod:.
 * The --prod only means to use environment.prod.ts and to create a compressed build.
 * It does not really mean "production".
 */


export const environment = {
  production: true,
};


const dev = {
  name:"Dev",
  url:"http://192.168.0.14:3000"
}


const beta = {
  name:"Stage",
  url:"https://pupmoney-beta.herokuapp.com"
}


const prod = {
  name:"Prod",
  url:"https://pupmoney-backend-prod.herokuapp.com"
}


export const BACKEND = prod;
