/**
 * 
 * @name Remove All Friends
 * @description Remove all friends from your friends list.
 * @author feelsz1n
 */

let routines = []

function routineAddCallback(callback, target) {
	routines.push({ "callback": callback, "targets": target })
}

async function RemoveFriends() {

  const list = await fetch("/lol-chat/v1/friends").then(res => res.json()).then(res => res.map(friend => [friend.name, friend.id]));
  const total = list.length
  let count = 0
  
  const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));

  Toast.promise(resolveAfter3Sec, {
    loading: "Initializing the process...",
    success: "",
    error: ""
  })

    if (total == 0) return Toast.error("You have no friends to remove!")

  
  const Interval = setInterval(async () => {

    const [name, id] = list.shift();
    
    const res = await fetch("/lol-chat/v1/friends/" + id, { method: "DELETE" })

    switch (res.status) {
      case 204:
        Toast.success("Removed " + name + " from your friend list!")
        count++
        break;
      case 404:
        Toast.error("Failed to remove " + name + " from your friend list!")
        break;
      default:
        Toast.error("You are being rate limited, Try again later!") && clearInterval(Interval)
        break;
    }

    if (count == total) Toast.success("Removed " + count + " friends!") && clearInterval(Interval)

  }, 5000)
}

async function addInviteAllButton() {
  const gameBar = document.querySelector(".lobby-header-buttons-container");

  if (!gameBar || document.querySelector("#removeAllDiv")) return;
  
  const mainDiv = document.createElement("div");
  mainDiv.id = "removeAllDiv";
  mainDiv.style.display = "flex";

  const button = document.createElement("lol-uikit-flat-button");
  button.textContent = "Remove All Friends";
  button.onclick = RemoveFriends;

  mainDiv.appendChild(button);

  gameBar.insertBefore(mainDiv, gameBar.children[1]);
}

window.addEventListener('load', () => {
  window.setInterval(() => {
    routines.forEach((routine) => {
      routine.callback();
    });
  }, 1000);

  routineAddCallback(addInviteAllButton, ["v2-header-component.ember-view"]);
});
