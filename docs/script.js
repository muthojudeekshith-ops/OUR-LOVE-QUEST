/* =========================================================
   OUR LOVE QUEST
   Frontend Version 1
========================================================= */


/* =========================================================
   APP DATA
========================================================= */

const app = {
  user: {
    name: "",
    email: ""
  },

  quest: {
    title: "",
    partner: "",
    code: "",
    link: "",
    joined: false,
    completed: false,

    items: [],

    rewards: []
  },

  currentItem: 0,

  selectedQuizAnswer: null
};


/* =========================================================
   SCREEN CONTROL
========================================================= */

function showScreen(id) {

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo(0, 0);
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* =========================================================
   SCREEN 1 — LOGIN
========================================================= */

function loginUser() {

  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();

  if (!name) {
    showToast("Please enter your name.");
    return;
  }

  if (!email || !email.includes("@")) {
    showToast("Please enter a valid email.");
    return;
  }

  app.user.name = name;
  app.user.email = email;

  document.getElementById("displayName").textContent = name;

  showScreen("screen-choice");
}


/* =========================================================
   CLOSE
========================================================= */

function closeCard() {

  showToast("Welcome to Our Love Quest ❤️");

}


/* =========================================================
   SCREEN 2
========================================================= */

function openCreate() {

  showScreen("screen-create");

}

function openJoin() {

  showScreen("screen-join");

}


/* =========================================================
   CREATE — SETUP
========================================================= */

function startBuilder() {

  const title =
    document.getElementById("questTitle").value.trim();

  const partner =
    document.getElementById("partnerName").value.trim();

  if (!title) {
    showToast("Give your adventure a title.");
    return;
  }

  if (!partner) {
    showToast("Enter your partner's name.");
    return;
  }

  app.quest.title = title;
  app.quest.partner = partner;

  document.getElementById("builderTitle").textContent = title;

  renderBuilder();

  showScreen("screen-builder");
}


/* =========================================================
   ADD TASK
========================================================= */

function addTask() {

  const title = prompt("Task title:");

  if (!title) return;

  const description =
    prompt("Task instructions:");

  app.quest.items.push({
    type: "TASK",
    title: title,
    description: description || "Complete this task."
  });

  renderBuilder();

}


/* =========================================================
   ADD QUIZ
========================================================= */

function addQuiz() {

  const question = prompt("Enter your question:");

  if (!question) return;

  const optionsText =
    prompt("Enter options separated by |");

  if (!optionsText) return;

  const options =
    optionsText
      .split("|")
      .map(option => option.trim())
      .filter(Boolean);

  if (options.length < 2) {
    showToast("Add at least 2 options.");
    return;
  }

  const correct =
    prompt(
      "Which option is correct? Enter its number.\n" +
      options.map((o, i) => `${i + 1}. ${o}`).join("\n")
    );

  app.quest.items.push({
    type: "QUIZ",
    title: question,
    description: "Choose your answer.",
    options: options,
    correct: Number(correct) - 1
  });

  renderBuilder();

}


/* =========================================================
   ADD CHALLENGE
========================================================= */

function addChallenge() {

  const title =
    prompt("Challenge title:");

  if (!title) return;

  const description =
    prompt("Challenge instructions:");

  app.quest.items.push({
    type: "CHALLENGE",
    title: title,
    description: description || "Complete this challenge."
  });

  renderBuilder();

}


/* =========================================================
   ADD REWARD
========================================================= */

function addReward() {

  const type =
    prompt(
      "Reward type:\n" +
      "Coupon\n" +
      "Surprise\n" +
      "Note\n" +
      "Letter\n" +
      "Caption\n" +
      "Expression of Love"
    );

  if (!type) return;

  const content =
    prompt("Write the reward content:");

  if (!content) return;

  app.quest.rewards.push({
    type: type,
    content: content
  });

  renderBuilder();

}


/* =========================================================
   BUILDER RENDER
========================================================= */

function renderBuilder() {

  const container =
    document.getElementById("builderItems");

  const count =
    document.getElementById("itemCount");

  count.textContent =
    app.quest.items.length;

  if (app.quest.items.length === 0) {

    container.innerHTML = `
      <div class="empty-builder">
        <div>♡</div>
        <p>Your quest is empty.</p>
        <small>Add your first challenge below.</small>
      </div>
    `;

    return;
  }

  container.innerHTML =
    app.quest.items.map((item, index) => {

      return `
        <div class="builder-item">

          <div class="item-number">
            ${index + 1}
          </div>

          <div class="item-info">
            <strong>${escapeHTML(item.title)}</strong>
            <small>${item.type}</small>
          </div>

          <button
            class="delete-item"
            onclick="deleteItem(${index})"
          >
            ×
          </button>

        </div>
      `;

    }).join("");

}


/* =========================================================
   DELETE ITEM
========================================================= */

function deleteItem(index) {

  app.quest.items.splice(index, 1);

  renderBuilder();

}


/* =========================================================
   FINISH CREATION
========================================================= */

function finishCreation() {

  if (app.quest.items.length === 0) {
    showToast("Add at least one task or challenge.");
    return;
  }

  if (app.quest.rewards.length === 0) {
    showToast("Add at least one reward.");
    return;
  }

  app.quest.code = generateCode();

  app.quest.link =
    window.location.href.split("?")[0] +
    "?quest=" +
    app.quest.code;

  document.getElementById("generatedCode")
    .textContent = app.quest.code;

  document.getElementById("generatedLink")
    .textContent = app.quest.link;

  showScreen("screen-code");

}


/* =========================================================
   CODE GENERATOR
========================================================= */

function generateCode() {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "";

  for (let i = 0; i < 6; i++) {

    result +=
      chars.charAt(
        Math.floor(Math.random() * chars.length)
      );

  }

  return result.slice(0, 3) + "-" + result.slice(3);

}


/* =========================================================
   COPY CODE
========================================================= */

async function copyCode() {

  try {

    await navigator.clipboard.writeText(
      app.quest.code
    );

    showToast("Code copied!");

  } catch {

    showToast("Copy failed. Copy it manually.");

  }

}


/* =========================================================
   COPY LINK
========================================================= */

async function copyLink() {

  try {

    await navigator.clipboard.writeText(
      app.quest.link
    );

    showToast("Link copied!");

  } catch {

    showToast("Copy failed. Copy it manually.");

  }

}


/* =========================================================
   JOIN
========================================================= */

function joinByLink() {

  const link =
    document.getElementById("joinLink").value.trim();

  if (!link) {
    showJoinMessage("Paste your partner's quest link.");
    return;
  }

  const code =
    extractQuestCode(link);

  if (!code) {
    showJoinMessage("That link doesn't look valid.");
    return;
  }

  joinQuest(code);

}


function joinByCode() {

  const code =
    document.getElementById("joinCode").value
      .trim()
      .toUpperCase();

  if (!code) {
    showJoinMessage("Enter your quest code.");
    return;
  }

  joinQuest(code);

}


/* =========================================================
   EXTRACT CODE
========================================================= */

function extractQuestCode(link) {

  try {

    const url =
      new URL(link);

    return url.searchParams
      .get("quest")
      ?.toUpperCase();

  } catch {

    return null;

  }

}


/* =========================================================
   JOIN QUEST
========================================================= */

function joinQuest(code) {

  /*
    FRONTEND DEMO ONLY.

    A real multi-device version will validate this code
    against a backend database and lock it after one Joiner.
  */

  const savedQuest =
    localStorage.getItem("ourLoveQuest_" + code);

  if (savedQuest) {

    const quest =
      JSON.parse(savedQuest);

    app.quest = quest;

    if (quest.joined) {

      showJoinMessage(
        "This adventure has already been joined."
      );

      return;
    }

  } else {

    /*
      Demo fallback:
      If the creator and joiner are testing
      on the same browser, the local quest
      can be used.
    */

    if (code !== app.quest.code) {

      showJoinMessage(
        "Quest not found. Check the code."
      );

      return;

    }

  }

  app.quest.joined = true;

  saveQuest();

  startQuest();

}


/* =========================================================
   START QUEST
========================================================= */

function startQuest() {

  if (app.quest.items.length === 0) {

    showJoinMessage(
      "This quest has no challenges yet."
    );

    return;

  }

  app.currentItem = 0;

  renderQuestItem();

  showScreen("screen-quest");

}


/* =========================================================
   RENDER QUEST ITEM
========================================================= */

function renderQuestItem() {

  const item =
    app.quest.items[app.currentItem];

  if (!item) {

    showRewards();

    return;

  }

  document.getElementById("questProgressText")
    .textContent =
    `${app.currentItem + 1} / ${app.quest.items.length}`;

  document.getElementById("questType")
    .textContent = item.type;

  document.getElementById("questItemTitle")
    .textContent = item.title;

  document.getElementById("questItemDescription")
    .textContent = item.description;

  const interaction =
    document.getElementById("questInteraction");

  interaction.innerHTML = "";

  app.selectedQuizAnswer = null;

  if (item.type === "QUIZ") {

    interaction.innerHTML = `
      <div class="quiz-options">
        ${item.options.map((option, index) => `
          <button
            class="quiz-option"
            onclick="selectQuizOption(${index})"
          >
            ${escapeHTML(option)}
          </button>
        `).join("")}
      </div>
    `;

  }

}


/* =========================================================
   QUIZ SELECTION
========================================================= */

function selectQuizOption(index) {

  app.selectedQuizAnswer = index;

  document.querySelectorAll(".quiz-option")
    .forEach((button, i) => {

      button.classList.toggle(
        "selected",
        i === index
      );

    });

}


/* =========================================================
   COMPLETE CURRENT ITEM
========================================================= */

function completeCurrentItem() {

  const item =
    app.quest.items[app.currentItem];

  if (!item) return;

  if (
    item.type === "QUIZ" &&
    app.selectedQuizAnswer === null
  ) {

    showToast("Choose an answer first.");
    return;

  }

  app.currentItem++;

  saveQuest();

  if (
    app.currentItem >=
    app.quest.items.length
  ) {

    showRewards();

  } else {

    renderQuestItem();

  }

}


/* =========================================================
   REWARDS
========================================================= */

function showRewards() {

  const list =
    document.getElementById("rewardsList");

  list.innerHTML =
    app.quest.rewards.map(reward => {

      return `
        <div class="reward-item">
          <strong>${escapeHTML(reward.type)}</strong>
          <span>${escapeHTML(reward.content)}</span>
        </div>
      `;

    }).join("");

  document.getElementById("finalProgress")
    .textContent =
    `${app.quest.items.length} / ${app.quest.items.length}`;

  document.getElementById("finalRewards")
    .textContent =
    `${app.quest.rewards.length} / ${app.quest.rewards.length}`;

  showScreen("screen-rewards");

}


/* =========================================================
   FINAL DONE
========================================================= */

function finishQuest() {

  app.quest.completed = true;

  saveQuest();

  showScreen("screen-complete");

}


/* =========================================================
   RETURN HOME
========================================================= */

function returnHome() {

  showScreen("screen-choice");

}


/* =========================================================
   BACK TO CHOICE
========================================================= */

function backToChoice() {

  showScreen("screen-choice");

}


/* =========================================================
   SAVE QUEST — DEMO STORAGE
========================================================= */

function saveQuest() {

  if (!app.quest.code) return;

  localStorage.setItem(
    "ourLoveQuest_" + app.quest.code,
    JSON.stringify(app.quest)
  );

}


/* =========================================================
   JOIN MESSAGE
========================================================= */

function showJoinMessage(message) {

  const element =
    document.getElementById("joinMessage");

  element.textContent = message;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent = value;

  return div.innerHTML;

}


/* =========================================================
   CHECK URL FOR QUEST
========================================================= */

window.addEventListener("load", () => {

  const params =
    new URLSearchParams(window.location.search);

  const code =
    params.get("quest");

  if (code) {

    showScreen("screen-join");

    document.getElementById("joinCode")
      .value = code.toUpperCase();

  }

});
