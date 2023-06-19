// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  onValue,
  off,
  remove,
  update
} from "firebase/database";
import { getAuth, updateProfile } from "firebase/auth";
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxrMm9d1h5vzkuN3GAyGPAY_gE_swu73I",
  authDomain: "pokemon-catcher-3fa2d.firebaseapp.com",
  projectId: "pokemon-catcher-3fa2d",
  storageBucket: "pokemon-catcher-3fa2d.appspot.com",
  messagingSenderId: "376920741265",
  appId: "1:376920741265:web:227d6aa22ba88474f13630",
  measurementId: "G-XZ8JJE681W",
  databaseURL: "https://pokemon-catcher-3fa2d-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);

const auth = getAuth(app);

const pushData = ({ link, data, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  push(ref(database, link), data)
    .then((result) => {
      successCallback(result);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const readData = ({ link, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  get(ref(database, link))
    .then((snapshot) => {
      successCallback(snapshot);
    })
    .catch((error) => {
      errorCallback(error);
    });
};
const setData = ({ link, data, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  set(ref(database, link), data)
    .then((snapshot) => {
      successCallback(snapshot);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const updateData = ({ link, data, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  update(ref(database, link), data)
    .then((snapshot) => {
      successCallback(snapshot);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const removeData = ({ link, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  remove(ref(database, link))
    .then((snapshot) => {
      successCallback(snapshot);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const firebaseSubscribe = (link, callback = () => {}) => {
  onValue(ref(database, link), (snapshot) => {
    callback(snapshot);
  });
};

const firebaseOff = (link, callback = () => {}) => {
  off(ref(database, link), (snapshot) => {
    callback(snapshot);
  });
};

export {
  app,
  database,
  auth,
  pushData,
  firebaseSubscribe,
  firebaseOff,
  setData,
  removeData,
  readData,
  updateData,
  firebaseConfig,
  updateProfile
};
