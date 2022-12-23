import main from "./main.js";

window.addEventListener("load", () => {
  //When the 'Create room" is button is clicked
  document.getElementById("create-room").addEventListener("click", (e) => {
    e.preventDefault();
    let roomName = document.querySelector("#room-name").value;
    let yourName = user;
    console.log(document.querySelector("#room-name"));
    if (roomName && yourName) {
      //remove error message, if any
      document.querySelector("#err-msg").innerHTML = "";

      //save the user's name in sessionStorage
      sessionStorage.setItem("username", yourName);

      //create room link
      let roomLink = `${location.origin}/call?room=${roomName
        .trim()
        .replace(" ", "_")}_${main.generateRandomString()}`;

      //show message with link to room
      document.querySelector(
        "#room-created"
      ).innerHTML = `Your meeting's ready! Start the <a href='${roomLink}'>Meet</a>!`;
      document.querySelector("#room-name").value = "";
    } else {
      document.querySelector("#err-msg").innerHTML = "All fields are required";
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("expand-remote-video")) {
      main.maximiseStream(e);
    } else if (e.target && e.target.classList.contains("mute-remote-mic")) {
      main.singleStreamToggleMute(e);
    }
  });
});

console.log(user,image)
document.getElementById("userName").textContent=user;
document.getElementById("userPhoto").src=image
// If user already have link
let roomname;
function existingroomjoin()
{
   roomname = document.querySelector("#existroom").value;
   document.getElementById("ejoinroom").href=roomname;

}

document.getElementById("ejoinroom").addEventListener("click",()=>{
  existingroomjoin();
  console.log(roomname);
})

