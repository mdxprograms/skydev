import { html, render } from "https://cdn.skypack.dev/lit-html";
import { repeat } from "https://cdn.skypack.dev/lit-html/directives/repeat";
import { types, onSnapshot } from "https://cdn.skypack.dev/mobx-state-tree";

const app = document.getElementById("app");

// Test Model
const Todo = types
  .model("Todo", {
    title: types.string,
    done: false,
  })
  .actions((self) => ({
    toggle() {
      self.done = !self.done;
    },
  }));

const Store = types
  .model("Store", {
    newTodo: types.string,
    todos: types.array(Todo),
  })
  .actions((self) => ({
    onNewTodoUpdate(text) {
      self.newTodo = text;
    },
    onNewTodoAdd() {
      self.todos.push({ title: self.newTodo, done: false })
      self.clearNewTodo()
    },
    clearNewTodo() {
      self.newTodo = ""
    }
  }));

const store = Store.create({
  newTodo: "",
  todos: [
    {
      title: "Get coffee",
    },
  ],
});

const TodoView = (todo) => {
  const styles = `
    cursor: pointer;
    text-decoration: ${todo.done ? "line-through" : "none"}
  `;

  return html`
    <li style=${styles} @click=${() => todo.toggle()}>${todo.title}</li>
  `;
};

const TodosView = (store) => html`
  <ul>
    ${store.todos.map(TodoView)}
  </ul>
`;

const NewTodo = (store) => html`
  <div id="new-todo">
    <input
      type="text"
      @input=${({ target }) => store.onNewTodoUpdate(target.value)}
    />
    <button @click=${store.onNewTodoAdd}>Add</button>
  </div>
`;

const MainView = (store) => html`
  <div id="main-view">${NewTodo(store)} ${TodosView(store)}</div>
`;

render(MainView(store), app);

onSnapshot(store, (snapshot) => {
  render(MainView(store), app);
});
