import * as React from "react"
import ShoppingList from "./components/ShoppingList";

export default class App extends React.Component {
  render() {
    return (
      <ShoppingList name="Products" />
    );
  }
}
