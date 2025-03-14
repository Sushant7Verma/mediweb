self.addEventListener("push", function (event) {
    let data = event.data ? event.data.text() : "Time to take your medicine!";
    event.waitUntil(
        self.registration.showNotification("Medicine Reminder", {
            body: data,
            icon: "/icon.png", // Add an icon for the notification
            vibrate: [200, 100, 200]
        })
    );
});
