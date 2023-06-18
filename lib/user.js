import { readData, setData } from "../firebaseConfig";
const checkEnergy = (user) => {
  readData({
    link: `users/${user.uid}/energy`,
    successCallback: (snapshot) => {
      if (snapshot && snapshot.val()) {
        const { time } = snapshot.val();

        const otherTimestamp = Date.now(); // Use the current timestamp or another timestamp as per your requirement
        const fiveMinutesInMillis = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (otherTimestamp - time >= fiveMinutesInMillis) {
          setData({
            link: `users/${user.uid}/energy`,
            data: {
              chance: 3,
              time: new Date().getTime(),
            },
          });
        }
      }
    },
  });
};

export { checkEnergy };
