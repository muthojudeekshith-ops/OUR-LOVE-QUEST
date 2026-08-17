/* =========================================================
   OUR LOVE QUEST — CREATOR CARD SYSTEM
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
   MODAL STATE
========================================================= */

let editingIndex = null;
let currentModalType = null;


/* =========================================================
   SCREEN CONTROL
========================================================= */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {
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

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);

}


/* =========================================================
   LOGIN
========================================================= */

function loginUser() {

  const name =
    document.getElementById("userName")
      .value.trim();

  const email =
    document.getElementById("userEmail")
      .value.trim();

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

  document.getElementById("displayName")
    .textContent = name;

  showScreen("screen-choice");
}


/* =========================================================
   BASIC NAVIGATION
========================================================= */

function closeCard() {
  showToast("Welcome to Our Love Quest ❤️");
}

function openCreate() {
  showScreen("screen-create");
}

function openJoin() {
  showScreen("screen-join");
}

function backToChoice() {
  showScreen("screen-choice");
}


/* =========================================================
   CREATOR SETUP
========================================================= */

function startBuilder() {

  const title =
    document.getElementById("questTitle")
      .value.trim();

  const partner =
    document.getElementById("partnerName")
      .value.trim();

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

  document.getElementById("builderTitle")
    .textContent = title;

  renderBuilder();

  showScreen("screen-builder");
}


/* =========================================================
   OPEN CREATOR MODAL
========================================================= */

function openCreatorModal(type, index = null) {

  currentModalType = type;
  editingIndex = index;

  const modal =
    document.getElementById("creatorModal");

  modal.classList.add("active");

  document
    .querySelectorAll(".modal-form")
    .forEach(form => {
      form.classList.remove("active");
    });


  const icons = {
    task: "✓",
    quiz: "?",
    challenge: "⚡",
    reward: "♥"
  };

  const titles = {
    task: "Add Task",
    quiz: "Add Quiz",
    challenge: "Add Challenge",
    reward: "Add Reward"
  };

  document.getElementById("modalIcon")
    .textContent = icons[type];

  document.getElementById("modalTitle")
    .textContent = titles[type];


  document.getElementById("modalSaveBtn")
    .textContent =
    index === null ? "Add" : "Save";


  const form =
    document.getElementById(type + "Form");

  form.classList.add("active");


  if (index !== null) {

    loadItemForEditing(type, index);

  } else {

    clearModalForm(type);

  }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeCreatorModal() {

  document
    .getElementById("creatorModal")
    .classList.remove("active");

  editingIndex = null;
  currentModalType = null;

}


/* =========================================================
   CLEAR FORMS
========================================================= */

function clearModalForm(type) {

  if (type === "task") {

    document.getElementById("taskTitle")
      .value = "";

    document.getElementById("taskDescription")
      .value = "";

  }


  if (type === "quiz") {

    document.getElementById("quizQuestion")
      .value = "";

    document.getElementById("quizOptions")
      .innerHTML = "";

    document.getElementById("quizCorrect")
      .innerHTML =
      `<option value="">
        Select correct answer
      </option>`;

    addQuizOption();
    addQuizOption();

  }


  if (type === "challenge") {

    document.getElementById("challengeTitle")
      .value = "";

    document.getElementById("challengeDescription")
      .value = "";

  }


  if (type === "reward") {

    document.getElementById("rewardType")
      .value = "";

    document.getElementById("rewardContent")
      .value = "";

    document
      .querySelectorAll(".reward-types button")
      .forEach(button => {
        button.classList.remove("selected");
      });

  }

}


/* =========================================================
   QUIZ OPTIONS
========================================================= */

function addQuizOption(value = "") {

  const container =
    document.getElementById("quizOptions");

  const index =
    container.children.length;

  const row =
    document.createElement("div");

  row.className =
    "quiz-option-editor";

  row.innerHTML = `

    <input
      class="modal-input quiz-option-input"
      type="text"
      placeholder="Option ${index + 1}"
      value="${escapeHTML(value)}"
    >

    <button
      type="button"
      class="remove-option-btn"
      onclick="removeQuizOption(this)"
    >
      ×
    </button>

  `;

  container.appendChild(row);

  updateCorrectAnswerOptions();

}


function removeQuizOption(button) {

  const container =
    document.getElementById("quizOptions");

  if (container.children.length <= 2) {

    showToast("A quiz needs at least 2 options.");

    return;

  }

  button.parentElement.remove();

  updateCorrectAnswerOptions();

}


function updateCorrectAnswerOptions() {

  const select =
    document.getElementById("quizCorrect");

  const inputs =
    document.querySelectorAll(
      ".quiz-option-input"
    );

  const oldValue =
    select.value;

  select.innerHTML =
    `<option value="">
      Select correct answer
    </option>`;

  inputs.forEach((input, index) => {

    const value =
      input.value.trim() ||
      `Option ${index + 1}`;

    const option =
      document.createElement("option");

    option.value = index;

    option.textContent =
      `${index + 1}. ${value}`;

    select.appendChild(option);

  });

  if (
    [...select.options]
      .some(option => option.value === oldValue)
  ) {

    select.value = oldValue;

  }

}


/* =========================================================
   REWARD TYPE
========================================================= */

function selectRewardType(button, type) {

  document
    .querySelectorAll(".reward-types button")
    .forEach(item => {
      item.classList.remove("selected");
    });

  button.classList.add("selected");

  document.getElementById("rewardType")
    .value = type;

}


/* =========================================================
   SAVE CREATOR ITEM
========================================================= */

function saveCreatorItem() {

  if (currentModalType === "task") {
    saveTask();
  }

  if (currentModalType === "quiz") {
    saveQuiz();
  }

  if (currentModalType === "challenge") {
    saveChallenge();
  }

  if (currentModalType === "reward") {
    saveReward();
  }

}


/* =========================================================
   SAVE TASK
========================================================= */

function saveTask() {

  const title =
    document.getElementById("taskTitle")
      .value.trim();

  const description =
    document.getElementById("taskDescription")
      .value.trim();

  if (!title) {
    showToast("Enter a task title.");
    return;
  }

  const item = {
    type: "TASK",
    title,
    description:
      description || "Complete this task."
  };

  saveItem(item);

}


/* =========================================================
   SAVE QUIZ
========================================================= */

function saveQuiz() {

  const question =
    document.getElementById("quizQuestion")
      .value.trim();

  const inputs =
    [...document.querySelectorAll(
      ".quiz-option-input"
    )];

  const options =
    inputs
      .map(input => input.value.trim())
      .filter(Boolean);

  const correct =
    document.getElementById("quizCorrect")
      .value;

  if (!question) {
    showToast("Enter your question.");
    return;
  }

  if (options.length < 2) {
    showToast("Add at least 2 options.");
    return;
  }

  if (correct === "") {
    showToast("Select the correct answer.");
    return;
  }

  const item = {

    type: "QUIZ",

    title: question,

    description:
      "Choose your answer.",

    options,

    correct:
      Number(correct)

  };

  saveItem(item);

}


/* =========================================================
   SAVE CHALLENGE
========================================================= */

function saveChallenge() {

  const title =
    document.getElementById("challengeTitle")
      .value.trim();

  const description =
    document.getElementById("challengeDescription")
      .value.trim();

  if (!title) {
    showToast("Enter a challenge title.");
    return;
  }

  const item = {

    type: "CHALLENGE",

    title,

    description:
      description ||
      "Complete this challenge."

  };

  saveItem(item);

}


/* =========================================================
   SAVE REWARD
========================================================= */

function saveReward() {

  const type =
    document.getElementById("rewardType")
      .value;

  const content =
    document.getElementById("rewardContent")
      .value.trim();

  if (!type) {
    showToast("Choose a reward type.");
    return;
  }

  if (!content) {
    showToast("Write your reward.");
    return;
  }

  const reward = {
    type,
    content
  };

  if (editingIndex !== null) {

    app.quest.rewards[editingIndex] =
      reward;

  } else {

    app.quest.rewards.push(reward);

  }

  closeCreatorModal();

  renderBuilder();

}


/* =========================================================
   SAVE ITEM
========================================================= */

function saveItem(item) {

  if (editingIndex !== null) {

    app.quest.items[editingIndex] =
      item;

  } else {

    app.quest.items.push(item);

  }

  closeCreatorModal();

  renderBuilder();

}


/* =========================================================
   LOAD ITEM FOR EDITING
========================================================= */

function loadItemForEditing(type, index) {

  if (type === "reward") {

    const reward =
      app.quest.rewards[index];

    document.getElementById("rewardType")
      .value = reward.type;

    document.getElementById("rewardContent")
      .value = reward.content;

    document
      .querySelectorAll(".reward-types button")
      .forEach(button => {

        button.classList.toggle(
          "selected",
          button.textContent.trim() === reward.type
        );

      });

    return;

  }


  const item =
    app.quest.items[index];


  if (type === "task") {

    document.getElementById("taskTitle")
      .value = item.title;

    document.getElementById("taskDescription")
      .value = item.description;

  }


  if (type === "challenge") {

    document.getElementById("challengeTitle")
      .value = item.title;

    document.getElementById("challengeDescription")
      .value = item.description;

  }


  if (type === "quiz") {

    document.getElementById("quizQuestion")
      .value = item.title;

    document.getElementById("quizOptions")
      .innerHTML = "";

    item.options.forEach(option => {
      addQuizOption(option);
    });

    updateCorrectAnswerOptions();

    document.getElementById("quizCorrect")
      .value = String(item.correct);

  }

}


/* =========================================================
   RENDER BUILDER
========================================================= */

function renderBuilder() {

  const container =
    document.getElementById("builderItems");

  document.getElementById("itemCount")
    .textContent =
    app.quest.items.length +
    app.quest.rewards.length;


  if (
    app.quest.items.length === 0 &&
    app.quest.rewards.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-builder">

        <div>♡</div>

        <p>Your quest is empty.</p>

        <small>
          Add your first item below.
        </small>

      </div>

    `;

    return;

  }


  let html = "";


  app.quest.items.forEach((item, index) => {

    html += builderCard(
      item,
      index,
      false
    );

  });


  app.quest.rewards.forEach((reward, index) => {

    html += builderCard(
      reward,
      index,
      true
    );

  });


  container.innerHTML = html;

}


/* =========================================================
   BUILDER CARD
========================================================= */

function builderCard(item, index, isReward) {

  const icon = {

    TASK: "✓",
    QUIZ: "?",
    CHALLENGE: "⚡"

  }[item.type] || "♥";


  const displayType =
    item.type || "REWARD";


  return `

    <div class="builder-item">

      <div class="item-number">
        ${icon}
      </div>

      <div class="item-info">

        <strong>
          ${escapeHTML(item.title || item.content)}
        </strong>

        <small>
          ${escapeHTML(displayType)}
        </small>

      </div>

      <div class="item-actions">

        <button
          class="edit-item"
          onclick="${
            isReward
              ? `openCreatorModal('reward',${index})`
              : `openCreatorModal('${displayType.toLowerCase()}',${index})`
          }"
        >
          ✎
        </button>

        <button
          class="delete-item"
          onclick="${
            isReward
              ? `deleteReward(${index})`
              : `deleteItem(${index})`
          }"
        >
          ×
        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   DELETE ITEM
========================================================= */

function deleteItem(index) {

  app.quest.items.splice(index, 1);

  renderBuilder();

}


function deleteReward(index) {

  app.quest.rewards.splice(index, 1);

  renderBuilder();

}


/* =========================================================
   FINISH CREATION
========================================================= */

function finishCreation() {

  if (app.quest.items.length === 0) {

    showToast(
      "Add at least one task, quiz or challenge."
    );

    return;

  }

  if (app.quest.rewards.length === 0) {

    showToast(
      "Add at least one reward."
    );

    return;

  }

  app.quest.code =
    generateCode();

  app.quest.link =
    window.location.href
      .split("?")[0] +
    "?quest=" +
    app.quest.code;


  document.getElementById("generatedCode")
    .textContent =
    app.quest.code;

  document.getElementById("generatedLink")
    .textContent =
    app.quest.link;


  saveQuest();

  showScreen("screen-code");

}


/* =========================================================
   CODE
========================================================= */

function generateCode() {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "";

  for (let i = 0; i < 6; i++) {

    result +=
      chars.charAt(
        Math.floor(
          Math.random() * chars.length
        )
      );

  }

  return (
    result.slice(0, 3) +
    "-" +
    result.slice(3)
  );

}


/* =========================================================
   COPY
========================================================= */

async function copyCode() {

  try {

    await navigator.clipboard.writeText(
      app.quest.code
    );

    showToast("Code copied!");

  } catch {

    showToast("Copy it manually.");

  }

}


async function copyLink() {

  try {

    await navigator.clipboard.writeText(
      app.quest.link
    );

    showToast("Link copied!");

  } catch {

    showToast("Copy it manually.");

  }

}


/* =========================================================
   JOIN
========================================================= */

function joinByLink() {

  const link =
    document.getElementById("joinLink")
      .value.trim();

  if (!link) {

    showJoinMessage(
      "Paste your partner's quest link."
    );

    return;

  }

  const code =
    extractQuestCode(link);

  if (!code) {

    showJoinMessage(
      "That link doesn't look valid."
    );

    return;

  }

  joinQuest(code);

}


function joinByCode() {

  const code =
    document.getElementById("joinCode")
      .value.trim()
      .toUpperCase();

  if (!code) {

    showJoinMessage(
      "Enter your quest code."
    );

    return;

  }

  joinQuest(code);

}


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

  const saved =
    localStorage.getItem(
      "ourLoveQuest_" + code
    );


  if (saved) {

    const quest =
      JSON.parse(saved);

    if (quest.joined) {

      showJoinMessage(
        "This adventure has already been joined."
      );

      return;

    }

    app.quest = quest;

  } else {

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
   QUEST
========================================================= */

function startQuest() {

  app.currentItem = 0;

  renderQuestItem();

  showScreen("screen-quest");

}


function renderQuestItem() {

  const item =
    app.quest.items[
      app.currentItem
    ];


  if (!item) {

    showRewards();

    return;

  }


  document.getElementById(
    "questProgressText"
  ).textContent =
    `${app.currentItem + 1} / ${app.quest.items.length}`;


  document.getElementById(
    "questType"
  ).textContent =
    item.type;


  document.getElementById(
    "questItemTitle"
  ).textContent =
    item.title;


  document.getElementById(
    "questItemDescription"
  ).textContent =
    item.description;


  const interaction =
    document.getElementById(
      "questInteraction"
    );

  interaction.innerHTML = "";

  app.selectedQuizAnswer = null;


  if (item.type === "QUIZ") {

    interaction.innerHTML = `

      <div class="quiz-options">

        ${item.options.map(
          (option, index) => `

            <button
              class="quiz-option"
              onclick="selectQuizOption(${index})"
            >
              ${escapeHTML(option)}
            </button>

          `
        ).join("")}

      </div>

    `;

  }

}


/* =========================================================
   QUIZ ANSWER
========================================================= */

function selectQuizOption(index) {

  app.selectedQuizAnswer =
    index;

  document
    .querySelectorAll(".quiz-option")
    .forEach((button, i) => {

      button.classList.toggle(
        "selected",
        i === index
      );

    });

}


/* =========================================================
   COMPLETE CHALLENGE
========================================================= */

function completeCurrentItem() {

  const item =
    app.quest.items[
      app.currentItem
    ];


  if (!item) return;


  if (
    item.type === "QUIZ" &&
    app.selectedQuizAnswer === null
  ) {

    showToast(
      "Choose an answer first."
    );

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
    document.getElementById(
      "rewardsList"
    );


  list.innerHTML =
    app.quest.rewards.map(
      reward => `

        <div class="reward-item">

          <strong>
            ${escapeHTML(reward.type)}
          </strong>

          <span>
            ${escapeHTML(reward.content)}
          </span>

        </div>

      `
    ).join("");


  document.getElementById(
    "finalProgress"
  ).textContent =
    `${app.quest.items.length} / ${app.quest.items.length}`;


  document.getElementById(
    "finalRewards"
  ).textContent =
    `${app.quest.rewards.length} / ${app.quest.rewards.length}`;


  showScreen("screen-rewards");

}


/* =========================================================
   FINAL
========================================================= */

function finishQuest() {

  app.quest.completed = true;

  saveQuest();

  showScreen("screen-complete");

}


function returnHome() {

  showScreen("screen-choice");

}


/* =========================================================
   STORAGE
========================================================= */

function saveQuest() {

  if (!app.quest.code) return;

  localStorage.setItem(
    "ourLoveQuest_" +
    app.quest.code,

    JSON.stringify(
      app.quest
    )
  );

}


/* =========================================================
   JOIN MESSAGE
========================================================= */

function showJoinMessage(message) {

  document.getElementById(
    "joinMessage"
  ).textContent =
    message;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    String(value);

  return div.innerHTML;

}


/* =========================================================
   URL QUEST
========================================================= */

window.addEventListener(
  "load",
  () => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const code =
      params.get("quest");


    if (code) {

      showScreen(
        "screen-join"
      );

      document.getElementById(
        "joinCode"
      ).value =
        code.toUpperCase();

    }

  }
);
