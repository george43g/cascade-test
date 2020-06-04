// import { } from 'fire'
import { https } from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export default https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});
