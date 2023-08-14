import * as React from "react"

export interface ListInterface {
  name: string
}

export default class ShoppingList extends React.Component<ListInterface, {}> {
  constructor(list: ListInterface) {
    super(list)
  }

  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}
