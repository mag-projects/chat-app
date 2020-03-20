// This function comes from the socket.io.js file and the io function bridges the server to the client
const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML; // .innerHTML gives us access to the html inside the script
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
};

// server (emit) -> client (receive) --acknowledgement--> serve

// client (emit) -> server (receive) --acknowledgement--> client

socket.on("message", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("HH:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

socket.on("locationMessage", (message) => {
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("HH:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

socket.on("roomData", ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    $sidebar.innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // disable
    $messageFormButton.setAttribute("disabled", "disabled");
    // Target provides access to the form
    const message = e.target.elements.message.value;
    // console.log(input);
    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();
        // enable

        if (error) return console.log(error);
        console.log("Message delivered!");
    });
});

$sendLocationButton.addEventListener("click", (e) => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not suppported by your browser.");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");
    // getCurrentPosition is not asynchronous
    navigator.geolocation.getCurrentPosition((position) => {

            // console.log(position);
            socket.emit("sendLocation", {
                    long: position.coords.longitude,
                    lat: position.coords.latitude
                }, () => {
                    $sendLocationButton.removeAttribute("disabled");
                    console.log("Location successfully sent!");
                }
            );
        }, PositionErrorCallback => {
        },
        PositionOptions = {enableHighAccuracy: false});
});

socket.emit("join", {username, room}, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});























