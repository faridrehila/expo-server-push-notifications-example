const express = require("express");
const { Expo } = require("expo-server-sdk");

const app = express();
const expo = new Expo();

app.use(express.json());

app.post("/send-notification", (req, res) => {
  const { token, title, body } = req.body;

  // Check if the token is valid
  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: "Invalid Expo push token" });
  }

  // Create the notification message
  const message = {
    to: token,
    sound: "default",
    title: title,
    body: body,
    data: { someData: "goes here" },
  };

  // Send the notification
  expo
    .sendPushNotificationsAsync([message])
    .then((ticket) => {
      console.log("Notification sent:", ticket);
      res.json({ success: true, ticket });
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
